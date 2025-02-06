import asyncio
import websockets
import json

async def send_temperature():
    uri = "ws://localhost:8000"
    start_temp = 19
    end_temp = 30
    delay = 2  # seconds

    async with websockets.connect(uri) as websocket:
        temperature = start_temp
        while temperature <= end_temp:
            message = {
                "method": "NotifyFullStatus",
                "params": {
                    "temperature:0": {
                        "tC": temperature
                    }
                }
            }
            await websocket.send(json.dumps(message))
            print(f"Sent temperature: {temperature}°C")
            await asyncio.sleep(delay)
            temperature += 1

        print("Temperature add complete.")
        await asyncio.sleep(5) # wait 5 seconds

        while temperature >= start_temp:
            message = {
                "method": "NotifyFullStatus",
                "params": {
                    "temperature:0": {
                        "tC": temperature
                    }
                }
            }
            await websocket.send(json.dumps(message))
            print(f"Sent temperature: {temperature}°C")
            await asyncio.sleep(delay)
            temperature -= 1

        # Close the connection
        await websocket.close()

# Run the asynchronous function
asyncio.run(send_temperature())
