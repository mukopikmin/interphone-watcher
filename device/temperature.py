from datetime import datetime
import os
import time
import time
import json
from seeed_dht import DHT
from dotenv import load_dotenv
from utils.iotcore import IoTCore
from sensors.tsl2561 import TSL2561

load_dotenv()

config = {}

DHT_SENSOR = int(os.environ.get("DHT_SENSOR") or "5")
REGION = os.environ.get("REGION")
DEVICE_ID = os.environ.get("DEVICE_ID")
PROJECT_ID = os.environ.get("PROJECT_ID")
REGISTRY_ID = os.environ.get("REGISTRY_ID")
INTERVAL = 60  # seconds


def main(
    algorithm,
    ca_certs,
    jwt_expires_minutes,
    message_type,
    mqtt_bridge_hostname,
    mqtt_bridge_port,
    private_key_file,
):
    iotcore = IoTCore(
        algorithm,
        ca_certs,
        REGION,
        DEVICE_ID,
        jwt_expires_minutes,
        message_type,
        mqtt_bridge_hostname,
        mqtt_bridge_port,
        private_key_file,
        PROJECT_ID,
        REGISTRY_ID,
    )

    # Publish to the events or state topic based on the flag.
    sub_topic = "events" if message_type == "event" else "state"

    mqtt_topic = "/devices/{}/{}/temperature".format(DEVICE_ID, sub_topic)

    jwt_iat = datetime.utcnow()
    jwt_exp_mins = jwt_expires_minutes

    dht = DHT("11", DHT_SENSOR)
    tsl = TSL2561()

    while True:
        iotcore.client.loop()

        humidity, temperature = dht.read()
        brightness = tsl.read()
        data = {
            "deviceId": DEVICE_ID,
            "timestamp": datetime.now().isoformat(),
            "humidity": humidity,
            "temperature": temperature,
            "brightness": brightness,
        }
        print(data)
        payload = json.dumps(data)

        seconds_since_issue = (datetime.utcnow() - jwt_iat).seconds
        if seconds_since_issue > 60 * jwt_exp_mins:
            print("Refreshing token after {}s".format(seconds_since_issue))
            jwt_iat = datetime.utcnow()
            iotcore.client.loop()
            iotcore.client.disconnect()
            iotcore.renew_client()

        iotcore.client.publish(mqtt_topic, payload, qos=1)

        for _ in range(0, INTERVAL):
            time.sleep(1)
            iotcore.client.loop()


if __name__ == "__main__":
    algorithm = "RS256"
    ca_certs = "keys/roots.pem"
    jwt_expires_minutes = 20
    message_type = "event"
    mqtt_bridge_hostname = "mqtt.googleapis.com"
    mqtt_bridge_port = 8883
    private_key_file = "keys/rsa_private.pem"

    main(
        algorithm,
        ca_certs,
        jwt_expires_minutes,
        message_type,
        mqtt_bridge_hostname,
        mqtt_bridge_port,
        private_key_file,
    )
