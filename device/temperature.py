import datetime
import os
import time
import time
import json
import seeed_dht
from dotenv import load_dotenv
import iotcore

load_dotenv()

config = {}

DHT_SENSOR = int(os.environ.get("DHT_SENSOR") or "5")
REGION = os.environ.get("REGION")
DEVICE_ID = os.environ.get("DEVICE_ID")
PROJECT_ID = os.environ.get("PROJECT_ID")
TEMPERATURE_REGISTRY_ID = os.environ.get("TEMPERATURE_REGISTRY_ID")


def main(
    algorithm,
    ca_certs,
    jwt_expires_minutes,
    message_type,
    mqtt_bridge_hostname,
    mqtt_bridge_port,
    private_key_file,
):
    """Connects a device, sends data, and receives data."""
    global config

    # Publish to the events or state topic based on the flag.
    sub_topic = "events" if message_type == "event" else "state"

    mqtt_topic = "/devices/{}/{}/temperature".format(DEVICE_ID, sub_topic)

    jwt_iat = datetime.datetime.utcnow()
    jwt_exp_mins = jwt_expires_minutes
    client = iotcore.get_client(
        PROJECT_ID,
        REGION,
        TEMPERATURE_REGISTRY_ID,
        DEVICE_ID,
        private_key_file,
        algorithm,
        ca_certs,
        mqtt_bridge_hostname,
        mqtt_bridge_port,
    )

    sensor = seeed_dht.DHT("11", DHT_SENSOR)

    while True:
        client.loop()

        humi, temp = sensor.read()
        data = {
            "deviceId": DEVICE_ID,
            "timestamp": datetime.datetime.now().isoformat(),
            "humidity": humi,
            "temperature": temp,
        }
        print(data)
        payload = json.dumps(data)

        seconds_since_issue = (datetime.datetime.utcnow() - jwt_iat).seconds
        if seconds_since_issue > 60 * jwt_exp_mins:
            print("Refreshing token after {}s".format(seconds_since_issue))
            jwt_iat = datetime.datetime.utcnow()
            client.loop()
            client.disconnect()
            client = iotcore.get_client(
                PROJECT_ID,
                REGION,
                TEMPERATURE_REGISTRY_ID,
                DEVICE_ID,
                private_key_file,
                algorithm,
                ca_certs,
                mqtt_bridge_hostname,
                mqtt_bridge_port,
            )

        client.publish(mqtt_topic, payload, qos=1)

        for _ in range(0, 60):
            time.sleep(1)
            client.loop()

    stream.stop_stream()
    stream.close()


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
