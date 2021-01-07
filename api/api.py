from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps
import os
import requests

app = Flask(__name__)
host = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/itemDatabase') + "?retryWrites=false"
app.config["MONGO_URI"] = host
mongo = PyMongo(app)

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

    print("enterede")
    stats_url = f'http://api.warframe.market/v1/items/{item_id}/statistics'
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

    set_url = f'http://api.warframe.market/v1/items/{item_id}'
    set_result = requests.get(set_url)
    set_json = set_result.json()
    set_payload = set_json["payload"]
    set = set_payload["item"]["items_in_set"]

    ducats = 0
    trading_tax = 0
    item_ids = []
    relics = []
    print(item_id)
    for item in set:
        if item["en"]["item_name"].strip().replace(" ", "_").lower() == item_id:
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

    new_item = {
        "ducats": ducats,
        "trading_tax": trading_tax,
        "items_in_set": item_ids,
        "relics": relics,
        "90day": {
            "avg": daily_avg,
            "min": daily_min,
            "max": daily_max,
            "daily": daily_data,
        },
        "48hr": {
            "avg": hourly_avg,
            "min": hourly_min,
            "max": hourly_max,
            "hourly": hourly_data,
        },
    }

    mongo.db.items.update_one({'item_id': item_id}, {"$set": new_item})
    # Database Call
    item = dumps(mongo.db.items.find_one({"item_id": item_id}))
    return item

@app.route('/api/watchlist/add/<item_id>')
def add_to_watchlist(item_id):
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'isWatched': True}})
    success = result.matched_count > 0
    return {"success": success}

@app.route('/api/watchlist/remove/<item_id>')
def remove_from_watchlist(item_id):
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'isWatched': False}})
    success = result.matched_count > 0
    return {"success": success}

@app.route('/api/watchlist/list')
def retrieve_watchlist():
    items = dumps(mongo.db.items.find({'isWatched': True}))
    return items
