""" This file is the backend for our project. It will serve json data to our
    front end, detailing information and statistics on each items. This data
    will be stored in a mongoDB database, and will be retrieved as necessary
    from the api provided by https://warframe.market/ via
    http://api.warframe.market/v1/ """

from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps
import os
import requests
import time

# Setup flask app and pymongo database
app = Flask(__name__)
host = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/itemDatabase') + "?retryWrites=false"
app.config["MONGO_URI"] = host
mongo = PyMongo(app)

# Route to start tracking an item for updates
@app.route('/api/items/track/<item_id>')
def track_item(item_id):
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'needs_stats': True}})
    success = result.matched_count > 0
    return {"success": success}

# Route to stop tracking an item for updates
@app.route('/api/items/untrack/<item_id>')
def untrack_item(item_id):
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'needs_stats': False}})
    success = result.matched_count > 0
    return {"success": success}

# Route to provide information on a single item
@app.route('/api/items/<item_id>')
def request_item(item_id):
    item = dumps(mongo.db.items.find({'item_id': item_id}))
    return item

# Route to add an item to our watchlist
@app.route('/api/watchlist/add/<item_id>')
def add_to_watchlist(item_id):
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'is_watched': True}})
    success = result.matched_count > 0
    return {"success": success}

# Route to remove an item from our watchlist
@app.route('/api/watchlist/remove/<item_id>')
def remove_from_watchlist(item_id):
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'is_watched': False}})
    success = result.matched_count > 0
    return {"success": success}

# Route to deliver all watched items
@app.route('/api/watchlist/list')
def retrieve_watchlist():
    items = dumps(mongo.db.items.find({'is_watched': True}))
    return items
