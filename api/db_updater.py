""" This file will query the api periodically and update our database accordingly """
import pymongo
import os
import requests
import time

client = pymongo.MongoClient("localhost", 27017)
db = client.itemDatabase

# update all items, will only happen once. This only gets minimal data
def update_items():
    db.items.drop()
    result = requests.get('http://api.warframe.market/v1/items')
    json = result.json()
    payload = json["payload"]
    items = payload["items"]

    for api_item in items:
        db_item = {
            "item_id": api_item["url_name"],
            "name": api_item["item_name"],
            "img_url": f'https://api.warframe.market/static/assets/{api_item["thumb"]}',
            "ducats": api_item["ducats"],
            "trading_tax": api_item["trading_tax"],
            "is_urgent": False,
            "is_watched": False,
            "needs_stats": False,
            "items_in_set": [],
            "relics": api_item["en"]["drop"],
            "max_mod_rank": api_item["mod_max_rank"],
            "order_history": [],
        }

        db.items.insert_one(db_item)

# update deeper statistics on watched items, this happens periodically
def update_watchlist():
    while True:
        watched_items = list(db.items.find( {'$or': [ { 'is_watched': True }, { 'needs_stats': True } ] }))

        for watched_item in watched_items:
            stats_url = f'http://api.warframe.market/v1/items/{watched_item["item_id"]}/statistics'
            stats_result = requests.get(stats_url)
            stats_json = stats_result.json()
            stats_payload = stats_json["payload"]
            stats = stats_payload["statistics_closed"]
            daily_data = []
            hourly_data = []
            num_hours = 0
            hourly_avg = 0
            hourly_min = 10000000000
            hourly_max = -1
            num_days = 0
            daily_avg = 0
            daily_min = 10000000000
            daily_max = -1
            isUrgent = False

            for hour in stats["48hours"]:
                hour_data = {
                    "min": hour["min_price"],
                    "max": hour["max_price"],
                    "avg": hour["avg_price"]
                }
                hourly_avg += hour["avg_price"]
                num_hours += 1
                if hour["min_price"] < hourly_min:
                    hourly_min = hour["min_price"]

                if hour["max_price"] > hourly_max:
                    hourly_max = hour["max_price"]

                hourly_data.append(hour_data)

            for day in stats["90days"]:
                day_data = {
                    "min": day["min_price"],
                    "max": day["max_price"],
                    "avg": day["avg_price"]
                }

                daily_avg += day["avg_price"]
                num_days += 1
                if day["min_price"] < daily_min:
                    daily_min = day["min_price"]

                if day["max_price"] > daily_max:
                    daily_max = day["max_price"]

                daily_data.append(day_data)

            if num_hours > 0:
                hourly_avg = hourly_avg / num_hours

            if num_days > 0:
                daily_avg = daily_avg / num_days

            set_url = f'http://api.warframe.market/v1/items/{watched_item["item_id"]}'
            set_result = requests.get(set_url)
            set_json = set_result.json()
            set_payload = set_json["payload"]
            set = set_payload["item"]["items_in_set"]

            ducats = 0
            trading_tax = 0
            item_ids = []
            relics = []

            for item in set:
                if item["en"]["item_name"] == watched_item["name"]:
                    try:
                        ducats = item["ducats"]
                        trading_tax = item["trading_tax"]
                        relics = item["en"]["drop"]
                    except:
                        ducats = -1
                        trading_tax = -1
                        relics = []
                else:
                    item_url = item["en"]["item_name"].strip().replace(" ", "_").lower()
                    item_ids.append(item_url)
            try:
                trading_tax = set[0]["trading_tax"]
            except:
                pass

            isUrgent = hourly_min < hourly_avg

            new_item = {
                "ducats": ducats,
                "trading_tax": trading_tax,
                "items_in_set": item_ids,
                "relics": relics,
                "is_urgent": isUrgent,
                "order_history": [
                  {
                    "platinum": 0,
                    "mod_rank": -1,
                  }
                ]
            }

            db.items.update_one({'item_id': watched_item["item_id"]}, {"$set": new_item})

        # do it every 5 seconds
        time.sleep(2)

update_items()
update_watchlist()
