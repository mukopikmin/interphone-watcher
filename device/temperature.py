import datetime
import logging
import os
import random
import ssl
import time
import wave
import time
import json

import numpy as np
import jwt
import paho.mqtt.client as mqtt
import iotcore
import seeed_dht

from dotenv import load_dotenv

load_dotenv()

config = {}


def main(
    algorithm,
    ca_certs,
    cloud_region,
    device_id,
    jwt_expires_minutes,
    listen_dur,
    message_type,
    mqtt_bridge_hostname,
    mqtt_bridge_port,
    private_key_file,
    project_id,
    registry_id,
):
    """Connects a device, sends data, and receives data."""
    global config

    # Publish to the events or state topic based on the flag.
    sub_topic = "events" if message_type == "event" else "state"

    mqtt_topic = "/devices/{}/{}/temperature".format(device_id, sub_topic)

    jwt_iat = datetime.datetime.utcnow()
    jwt_exp_mins = jwt_expires_minutes
    client = iotcore.get_client(
        project_id,
        cloud_region,
        registry_id,
        device_id,
        private_key_file,
        algorithm,
        ca_certs,
        mqtt_bridge_hostname,
        mqtt_bridge_port,
    )

    sensor = seeed_dht.DHT("11", 12)

    while True:
        client.loop()

        humi, temp = sensor.read()
        data = {
            "deviceId": device_id,
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
                project_id,
                cloud_region,
                registry_id,
                device_id,
                private_key_file,
                algorithm,
                ca_certs,
                mqtt_bridge_hostname,
                mqtt_bridge_port,
            )

        client.publish(mqtt_topic, payload, qos=1)

        for i in range(0, 60):
            time.sleep(1)
            client.loop()

    stream.stop_stream()
    stream.close()


if __name__ == "__main__":
    algorithm = "RS256"
    ca_certs = "keys/roots.pem"
    cloud_region = os.environ.get("REGION")
    device_id = os.environ.get("DEVICE_ID")
    jwt_expires_minutes = 20
    listen_dur = 60
    message_type = "event"
    mqtt_bridge_hostname = "mqtt.googleapis.com"
    mqtt_bridge_port = 8883
    private_key_file = "keys/rsa_private.pem"
    project_id = os.environ.get("PROJECT_ID")
    registry_id = os.environ.get("TEMPERATURE_REGISTRY_ID")

    main(
        algorithm,
        ca_certs,
        cloud_region,
        device_id,
        jwt_expires_minutes,
        listen_dur,
        message_type,
        mqtt_bridge_hostname,
        mqtt_bridge_port,
        private_key_file,
        project_id,
        registry_id,
    )
