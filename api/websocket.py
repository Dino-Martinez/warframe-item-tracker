import asyncio
import websockets
import requests
import json
import pymongo

client = pymongo.MongoClient("localhost", 27017)
db = client.itemDatabase

async def storeResponse(message):
  new_order = {}
  responseJson = json.loads(message)
  print(json.dumps(responseJson, indent=2))
  # Filter websocket data on sell orders only
  if (responseJson["type"] == "@WS/SUBSCRIPTIONS/MOST_RECENT/NEW_ORDER" and responseJson["payload"]["order"]["order_type"] == "sell"):
    item_id = responseJson["payload"]["order"]["item"]["url_name"]
    db_item = db.items.find_one({'item_id': item_id})
    order_history = db_item["order_history"]
    if (len(order_history) > 50):
      order_history.pop()
    # filter mods, not riven or syndicate mods
    if("mod_rank" in responseJson["payload"]["order"] and "max_mod_rank" in responseJson["payload"]["order"]["item"]):
      #filter out mods that are not at max rank
      if (responseJson["payload"]["order"]["mod_rank"] == responseJson["payload"]["order"]["item"]["mod_max_rank"]):
        new_order = {
        "platinum" : responseJson["payload"]["order"]["platinum"],
      }
      else:
        return {"success": False}
    # everything else
    else:
      new_order = {
        "platinum" : responseJson["payload"]["order"]["platinum"],
      }
    order_history.append(new_order)

    # Calculate min, max and average prices
    min_price = db_item["min_price"]
    max_price = db_item["max_price"]
    if responseJson["payload"]["order"]["platinum"] < min_price:
      min_price = responseJson["payload"]["order"]["platinum"]
    if responseJson["payload"]["order"]["platinum"] > max_price:
      max_price = responseJson["payload"]["order"]["platinum"]
    num_items = 0
    total_platinum = 0
    for item in order_history:
      total_platinum += item["platinum"]
      num_items += 1
    avg_price = round(total_platinum / num_items, 2)
    is_urgent = min_price < avg_price

    db.items.update_one({'item_id': item_id}, {"$set": {"order_history": order_history, "avg_price": avg_price, "min_price": min_price, "max_price": max_price, "is_urgent": is_urgent}})
  return {"success" : True}

async def socket():
    '''Websocket that connects to the Warframe Market Websocket'''
    async with websockets.connect(
            'wss://warframe.market/socket',
            timeout=30,
            extra_headers={
                'Authorization': 'JWT=5ed9af08fa08dc07b3d63ad0'
            }) as websocket:
        await websocket.send('{"type": "@WS/SUBSCRIBE/MOST_RECENT"}')
        async for message in websocket:
            await storeResponse(message)

asyncio.get_event_loop().run_until_complete(socket())
