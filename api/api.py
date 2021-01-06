from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps
import os
import requests
import time

app = Flask(__name__)
host = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/userDatabase') + "?retryWrites=false"
app.config["MONGO_URI"] = host
mongo = PyMongo(app)

def populate_db():
    for _ in range(15):
        result = requests.get('http://api.warframe.market/v1/items')
        json = result.json()

        # build db from json


        print(json)
        time.sleep(1)

populate_db()

mongo.db.test.delete_many({})
mongo.db.test.insert([
    {
        "item_id": "test_name_1",
        "name": "Test Name",
        "img_url": "https://api.warframe.market/static/assets/icons/en/thumbs/trinity_prime_neuroptics.4115dba418ab8ee70197a7fdaee8da76.128x128.png",
        "ducats": 500,
        "trading_tax": 500,
        "isUrgent": False,
        "isWatched": False,
        "items_in_set": [
            {"item_id": "test_name_2"},
            {"item_id": "test_name_3"},
        ],
        "relics": [
            "Test Relic 1",
            "Test Relic 2",
            "Test Relic 3",
            "Test Relic 4",
        ],
        "48hr": [
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
        ],
        "90day": [
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
        ],
    },
    {
        "item_id": "test_name_2",
        "name": "Test Name 2",
        "img_url": "https://api.warframe.market/static/assets/icons/en/thumbs/trinity_prime_neuroptics.4115dba418ab8ee70197a7fdaee8da76.128x128.png",
        "ducats": 250,
        "trading_tax": 520,
        "isUrgent": True,
        "isWatched": True,
        "items_in_set": [
            {"item_id": "test_name_1"},
            {"item_id": "test_name_3"},
        ],
        "relics": [
            "Test Relic 1",
            "Test Relic 2",
            "Test Relic 3",
            "Test Relic 4",
        ],
        "48hr": [
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
        ],
        "90day": [
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
        ],
    },
    {
        "item_id": "test_name_3",
        "name": "Test Name 3",
        "img_url": "https://api.warframe.market/static/assets/icons/en/thumbs/trinity_prime_neuroptics.4115dba418ab8ee70197a7fdaee8da76.128x128.png",
        "ducats": 5000000,
        "trading_tax": 50000000,
        "isUrgent": False,
        "isWatched": True,
        "items_in_set": [
            {"item_id": "test_name_1"},
            {"item_id": "test_name_2"},
        ],
        "relics": [
            "Test Relic 1",
            "Test Relic 2",
            "Test Relic 3",
            "Test Relic 4",
        ],
        "48hr": [
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
        ],
        "90day": [
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
            {"avg": 5, "min": 3, "max": 7},
        ],
    },
])

@app.route('/api/test/<item_id>')
def api_test_data_single_item(item_id):
    item = dumps(mongo.db.test.find_one({"item_id": item_id}))
    return item


@app.route('/api/test/watch_list')
def api_test_data_watch_list():
    items = dumps(mongo.db.test.find({"isWatched": True}))
    return items

@app.route('/api/items/<item_id>')
def item_data(item_id):
    item = dumps(mongo.db.test.find_one({"item_id": item_id}))
    return item

@app.route('/api/watchlist/add/<item_id>')
def add_to_watchlist(item_id):
    try:
        result = mongo.db.test.update_one({'item_id': item_id}, {"$set": {'isWatched': True}})
        print(result)
        return {"success": True}
    except:
        return {"success": False}

@app.route('/api/watchlist/remove/<item_id>')
def remove_from_watchlist(item_id):
    try:
        result = mongo.db.test.update_one({'item_id': item_id}, {"$set": {'isWatched': False}})
        return {"success": True}
    except:
        return {"success": False}

@app.route('/api/watchlist/list')
def retrieve_watchlist():
    items = dumps(mongo.db.test.find({'isWatched': True}))
    return items
