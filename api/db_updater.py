""" This file will query the api periodically and update our database accordingly """
import pymongo
import os
import requests
import time
import json as jsonn

client = pymongo.MongoClient("localhost", 27017)
db = client.itemDatabase

def initialize_items():
    """ Initialize all items with default data, populating what we can from the api """


    # Get api data
    result = requests.get('http://api.warframe.market/v1/items')
    json = result.json()
    payload = json["payload"]
    items = payload["items"]

    # Add all items to our database
    for api_item in items:
        # If we already have initial data, don't do anything
        item = db.items.find_one({"item_id": api_item["url_name"]})
        if item is None:
            newRequest = requests.get(f'http://api.warframe.market/v1/items/{api_item["url_name"]}')
            json = newRequest.json()
            payload = json["payload"]
            set = payload["item"]["items_in_set"]
            item_ids = []
            ducats = None
            trading_tax = None
            relics = None
            mod_max_rank = None

            for item in set:
                item_ids.append(item["url_name"])
                if "en" in item and item["url_name"] is api_item["url_name"]:
                    ducats = item["ducats"] if ("ducats" in item) else -1
                    trading_tax = item["trading_tax"] if ("trading_tax" in item) else -1
                    relics = item["en"]["drop"] if ("drop" in item["en"]) else 0
                    mod_max_rank = item["mod_max_rank"] if ("mod_max_rank" in item) else 0

            db_item = {
                "item_id": api_item["url_name"],
                "name": api_item["item_name"],
                "img_url": f'https://api.warframe.market/static/assets/{api_item["thumb"]}',
                "ducats": ducats,
                "trading_tax": trading_tax,
                "is_urgent": False,
                "is_watched": False,
                "needs_stats": False,
                "items_in_set": item_ids,
                "relics": relics,
                "max_mod_rank": mod_max_rank,
                "avg_price": 0,
                "min_price": 100000,
                "max_price": -1,
                "order_history": [],
            }
            print(f"{db_item.name)} was added!")

            db.items.insert_one(db_item)

def update_database():
    """Every hour we update the avg, min, max price on all items"""

    items = list(db.items.find({}))
    for item in items:
        # Because not all items have recent data, here we take the MOST recent data
        item_id = item["item_id"]
        itemStats = requests.get(f'http://api.warframe.market/v1/items/{item_id}/statistics')
        json = itemStats.json()
        payload = json["payload"]

        if len(payload["statistics_closed"]["48hours"]) > 0:
            statistics = payload["statistics_closed"]["48hours"]
        elif len(payload["statistics_closed"]["90days"]) > 0:
            statistics = payload["statistics_closed"]["90days"]
        elif len(payload["statistics_live"]["48hours"]) > 0:
            statistics = payload["statistics_live"]["48hours"]
        elif len(payload["statistics_live"]["90days"]) > 0:
            statistics = payload["statistics_live"]["90days"]

        most_recent = statistics[len(statistics) - 1]
        db_item = {
          "min_price": most_recent["min_price"],
          "max_price": most_recent["max_price"],
        }
        db.items.update_one({"item_id": item_id}, {"$set" : db_item})

while True:
    time.sleep(3600)
    update_database()
# initialize_items()
