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
            "img_url": api_item["thumb"],
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

        for item in watched_items:
            print("updating...")
            url = f'http://api.warframe.market/v1/items/{item["item_id"]}/statistics'
            result = requests.get(url)
            json = result.json()
            payload = json["payload"]
            stats = payload["statistics_closed"]
            new_item = {
                "90day": stats["90days"],
                "48hr": stats["48hours"],
            }

            db.items.update_one({'item_id': item["item_id"]}, {"$set": new_item})
            print("updated")

        # do it every 5 seconds
        time.sleep(5)


update_watchlist()
