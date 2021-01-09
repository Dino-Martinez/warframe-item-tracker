import asyncio
import websockets
import requests

async def consumer(message):
    print(message)
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
            await consumer(message)

asyncio.get_event_loop().run_until_complete(socket())
