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
  # Here I filter my websocket data to only show me new sell orders
  if (responseJson["type"] == "@WS/SUBSCRIPTIONS/MOST_RECENT/NEW_ORDER" and responseJson["payload"]["order"]["order_type"] == "sell"):
    print(json.dumps(responseJson, indent=2))
    item_id = responseJson["payload"]["order"]["item"]["url_name"]
    # find an item and its order history
    db_item = db.items.find_one({'item_id': item_id})
    order_history = db_item["order_history"]
    # only store 50 most recent orders
    if (len(order_history) > 50):
      order_history.pop()
    # filter mods only, NOT RIVENS OR SYNDICATE ITEMS
    if("mod" in responseJson["payload"]["order"]["item"]["tags"] and "riven" not in responseJson["payload"]["order"]["item"]["tags"] and "syndicate" not in responseJson["payload"]["order"]["item"]["tags"]):
      #filter bad mods out
      if (responseJson["payload"]["order"]["mod_rank"] == responseJson["payload"]["order"]["item"]["mod_max_rank"]):
        new_order = {
        "platinum" : responseJson["payload"]["order"]["platinum"],
      }
      else:
        return
    # everything else
    else:
      new_order = {
        "platinum" : responseJson["payload"]["order"]["platinum"],
      }
    # Calculate min and max prices
    min_price = db_item["min_price"]
    max_price = db_item["max_price"]
    if responseJson["payload"]["order"]["platinum"] < min_price:
      min_price = responseJson["payload"]["order"]["platinum"]
    if responseJson["payload"]["order"]["platinum"] > max_price:
      max_price = responseJson["payload"]["order"]["platinum"]

    #Calulate avg price
    order_history.append(new_order)
    print(order_history, "ORDER HISTORY---------------------")
    num_items = 0
    total_platinum = 0
    for item in order_history:
      total_platinum += item["platinum"]
      num_items += 1
    avg_price = total_platinum / num_items

    is_urgent = min_price < avg_price

    db.items.update_one({'item_id': item_id}, {"$set": {"order_history": order_history, "avg_price": avg_price, "min_price": min_price, "max_price": max_price, "is_urgent": is_urgent}})



  print(json.dumps(message, indent = 2))
  return "hello"

async def socket():
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
