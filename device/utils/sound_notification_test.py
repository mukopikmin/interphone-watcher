import json
from datetime import datetime
import os
from os import path
from dotenv import load_dotenv
from iotcore import IoTCore
import time

load_dotenv(path.join(path.dirname(__file__), "..", ".env"))


def main(
    algorithm,
    ca_certs,
    cloud_region,
    device_id,
    jwt_expires_minutes,
    message_type,
    mqtt_bridge_hostname,
    mqtt_bridge_port,
    private_key_file,
    project_id,
    registry_id,
):
    iotcore = IoTCore(
        algorithm,
        ca_certs,
        cloud_region,
        device_id,
        jwt_expires_minutes,
        message_type,
        mqtt_bridge_hostname,
        mqtt_bridge_port,
        private_key_file,
        project_id,
        registry_id,
    )
    # Publish to the events or state topic based on the flag.
    sub_topic = "events" if message_type == "event" else "state"

    mqtt_topic = "/devices/{}/{}/interphone".format(device_id, sub_topic)

    payload = {
        "timestamp": datetime.now().isoformat(),
        "volume": 0,
    }

    iotcore.client.publish(mqtt_topic, json.dumps(payload), qos=1)

    print(payload)
    time.sleep(3)


if __name__ == "__main__":
    algorithm = "RS256"
    ca_certs = path.join(path.dirname(__file__), "..", "keys", "roots.pem")
    cloud_region = os.environ.get("REGION")
    device_id = os.environ.get("DEVICE_ID")
    jwt_expires_minutes = 20
    message_type = "event"
    mqtt_bridge_hostname = "mqtt.googleapis.com"
    mqtt_bridge_port = 8883
    private_key_file = path.join(
        path.dirname(__file__), "..", "keys", "rsa_private.pem"
    )
    project_id = os.environ.get("PROJECT_ID")
    registry_id = os.environ.get("REGISTRY_ID")

    main(
        algorithm,
        ca_certs,
        cloud_region,
        device_id,
        jwt_expires_minutes,
        message_type,
        mqtt_bridge_hostname,
        mqtt_bridge_port,
        private_key_file,
        project_id,
        registry_id,
    )
