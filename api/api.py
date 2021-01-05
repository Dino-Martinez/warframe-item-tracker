from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps
import os

app = Flask(__name__)
host = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/userDatabase') + "?retryWrites=false"
app.config["MONGO_URI"] = host
mongo = PyMongo(app)


mongo.db.items.delete_many({})
mongo.db.items.insert([
    {"item_id": "itemIdOne", "name": "Test data", "average": 5, "min": 5, "max": 15, "isUrgent": False},
    {"item_id": "itemIdTwo", "name": "Test data", "average": 5, "min": 15, "max": 25, "isUrgent": False},
    {"item_id": "itemIdThree", "name": "Test data", "average": 5, "min": 35, "max": 35, "isUrgent": False},
    {"item_id": "itemIdFour", "name": "Test data", "average": 5, "min": 35, "max": 35, "isUrgent": True},
    {"item_id": "itemIdFive", "name": "Test data", "average": 5, "min": 35, "max": 35, "isUrgent": False},
    {"item_id": "itemIdSix", "name": "Test data", "average": 5, "min": 35, "max": 35, "isUrgent": True},
])

@app.route('/api/')
def api_home():
    items = dumps(mongo.db.items.find({}))
    return items
