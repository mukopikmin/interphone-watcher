import time
import os
from seeed_dht import DHT
from dotenv import load_dotenv
from sensors.tsl2561 import TSL2561

load_dotenv()

DHT_SENSOR = int(os.environ.get("DHT_SENSOR") or "5")

print(f"Using DHT sensor on port {DHT_SENSOR}")

dht = DHT("11", DHT_SENSOR)
tsl = TSL2561()

while True:
    humidity, temperature = dht.read()
    brightness = tsl.read()

    print(f"Temperature: {temperature}, Humidity: {humidity}, Brightness: {brightness}")
    time.sleep(1)
