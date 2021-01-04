from flask import Flask
import random

app = Flask(__name__)

@app.route('/api/')
def api_home():
    r = random.randint(1, 100)
    items = [
        {"id": "itemIdOne", "name": "Test data", "average": r, "min": 5, "max": 15, "isUrgent": False},
        {"id": "itemIdTwo", "name": "Test data", "average": r, "min": 15, "max": 25, "isUrgent": False},
        {"id": "itemIdThree", "name": "Test data", "average": r, "min": 35, "max": 35, "isUrgent": False},
        {"id": "itemIdFour", "name": "Test data", "average": r, "min": 35, "max": 35, "isUrgent": True},
        {"id": "itemIdFive", "name": "Test data", "average": r, "min": 35, "max": 35, "isUrgent": False},
        {"id": "itemIdSix", "name": "Test data", "average": r, "min": 35, "max": 35, "isUrgent": True},
    ]
    return {"items": items }
