import pymongo
import os
import requests
import time

client = pymongo.MongoClient("localhost", 27017)
db = client.itemDatabase

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
            "ducats": 500,
            "trading_tax": 500,
            "isUrgent": False,
            "isWatched": False,
            "items_in_set": [],
            "relics": [],
            "48hr": [],
            "90day": [],
        }

        db.items.insert_one(db_item)

def update_watchlist():
    while True:
        watched_items = list(db.items.find({'isWatched': True}))

        for watched_item in watched_items:
            stats_url = f'http://api.warframe.market/v1/items/{watched_item["item_id"]}/statistics'
            stats_result = requests.get(stats_url)
            stats_json = stats_result.json()
            stats_payload = stats_json["payload"]
            stats = stats_payload["statistics_closed"]
            daily_data = []
            hourly_data = []

            for hour in stats["48hours"]:
                hour_data = {
                    "min": hour["min_price"],
                    "max": hour["max_price"],
                    "avg": hour["avg_price"]
                }
                hourly_data.append(hour_data)

            for day in stats["90days"]:
                day_data = {
                    "min": day["min_price"],
                    "max": day["max_price"],
                    "avg": day["avg_price"]
                }
                daily_data.append(day_data)

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
                    ducats = item["ducats"]
                    trading_tax = item["trading_tax"]
                    relics = item["en"]["drop"]
                else:
                    item_url = item["en"]["item_name"].strip().replace(" ", "_").lower()
                    item_ids.append(item_url)


            new_item = {
                "ducats": ducats,
                "trading_tax": trading_tax,
                "items_in_set": item_ids,
                "relics": relics,
                "90day": daily_data,
                "48hr": hourly_data,
            }

            db.items.update_one({'item_id': watched_item["item_id"]}, {"$set": new_item})

        # do it every 5 seconds
        time.sleep(5)

update_items()
update_watchlist()
