from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps
import os

app = Flask(__name__)
host = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/userDatabase') + "?retryWrites=false"
app.config["MONGO_URI"] = host
mongo = PyMongo(app)


mongo.db.test.delete_many({})
mongo.db.test.insert([
    {
        "item_id": "test_name",
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
            "Test Relic",
            "Test Relic",
            "Test Relic",
            "Test Relic",
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
        "isWatched": False,
        "items_in_set": [
            {"item_id": "test_name_1"},
            {"item_id": "test_name_3"},
        ],
        "relics": [
            "Test Relic",
            "Test Relic",
            "Test Relic",
            "Test Relic",
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
        "isWatched": False,
        "items_in_set": [
            {"item_id": "test_name_1"},
            {"item_id": "test_name_2"},
        ],
        "relics": [
            "Test Relic",
            "Test Relic",
            "Test Relic",
            "Test Relic",
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


@app.route('/api/test/item_list')
def api_test_data_item_list():
    items = dumps(mongo.db.test.find({}))
    return items
