""" 
This file is the backend for our project. It will serve json data to our
front end, detailing information and statistics on each items. This data
will be stored in a mongoDB database, and will be retrieved as necessary
from the api provided by https://warframe.market/ via
http://api.warframe.market/v1/ 
"""

from flask import Flask
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.json_util import dumps
import os
import requests
import time
import asyncio


# Setup flask app and pymongo database
app = Flask(__name__)
host = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/itemDatabase') + "?retryWrites=false"
app.config["MONGO_URI"] = host
mongo = PyMongo(app)

@app.route('/api/items/track/<item_id>')
def track_item(item_id):
  '''Route to start tracking an item for updates'''
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'needs_stats': True}})
    success = result.matched_count > 0
    return {"success": success}

@app.route('/api/items/untrack/<item_id>')
def untrack_item(item_id):
  '''Route to stop tracking an item for updates'''
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'needs_stats': False}})
    success = result.matched_count > 0
    return {"success": success}

@app.route('/api/items/<item_id>')
def request_item(item_id):
  '''Route to provide information on a single item '''
    item = dumps(mongo.db.items.find({'item_id': item_id}))
    return item

@app.route('/api/watchlist/add/<item_id>')
def add_to_watchlist(item_id):
  '''Route to add an item to our watchlist'''
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'is_watched': True}})
    success = result.matched_count > 0
    return {"success": success}

@app.route('/api/watchlist/remove/<item_id>')
def remove_from_watchlist(item_id):
  '''Route to remove an item from our watchlist'''
    result = mongo.db.items.update_one({'item_id': item_id}, {"$set": {'is_watched': False}})
    success = result.matched_count > 0
    return {"success": success}

@app.route('/api/watchlist/list')
def retrieve_watchlist():
  '''Route to deliver all watched items'''
    items = dumps(mongo.db.items.find({'is_watched': True}))
    return items

@app.route('/api/items')
def retrieve_all_items():
  '''Route to deliver all items'''
  items = dumps(mongo.db.items.find({}))
  return items
