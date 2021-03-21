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
import pyaudio
import jwt
import paho.mqtt.client as mqtt

logging.getLogger("googleapiclient.discovery_cache").setLevel(logging.CRITICAL)


config = {"sensor_enabled": False, "threshold": 150, "act_once": False}


def create_jwt(project_id, private_key_file, algorithm):
    """Creates a JWT (https://jwt.io) to establish an MQTT connection.
    Args:
     project_id: The cloud project ID this device belongs to
     private_key_file: A path to a file containing either an RSA256 or
             ES256 private key.
     algorithm: The encryption algorithm to use. Either 'RS256' or 'ES256'
    Returns:
        A JWT generated from the given project_id and private key, which
        expires in 20 minutes. After 20 minutes, your client will be
        disconnected, and a new JWT will have to be generated.
    Raises:
        ValueError: If the private_key_file does not contain a known key.
    """

    token = {
        # The time that the token was issued at
        "iat": datetime.datetime.utcnow(),
        # The time the token expires.
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=20),
        # The audience field should always be set to the GCP project id.
        "aud": project_id,
    }

    # Read the private key file.
    with open(private_key_file, "r") as f:
        private_key = f.read()

    print(
        "Creating JWT using {} from private key file {}".format(
            algorithm, private_key_file
        )
    )

    return jwt.encode(token, private_key, algorithm=algorithm)


def error_str(rc):
    """Convert a Paho error to a human readable string."""
    return "{}: {}".format(rc, mqtt.error_string(rc))


def on_connect(unused_client, unused_userdata, unused_flags, rc):
    """Callback for when a device connects."""
    print("on_connect", mqtt.connack_string(rc))


def on_disconnect(unused_client, unused_userdata, rc):
    """Paho callback for when a device disconnects."""
    print("on_disconnect", error_str(rc))


def on_publish(unused_client, unused_userdata, unused_mid):
    """Paho callback when a message is sent to the broker."""


def on_message(unused_client, unused_userdata, message):
    global config

    """Callback when the device receives a message on a subscription."""
    payload_str = str(message.payload.decode("utf-8"))
    payload = json.loads(payload_str)

    config["sensor_enabled"] = payload["sensorEnabled"]
    config["threshold"] = payload["threshold"]
    config["act_once"] = payload["actOnce"]

    print(
        "Received message '{}' on topic '{}' with Qos {}".format(
            payload, message.topic, str(message.qos)
        )
    )


def get_client(
    project_id,
    cloud_region,
    registry_id,
    device_id,
    private_key_file,
    algorithm,
    ca_certs,
    mqtt_bridge_hostname,
    mqtt_bridge_port,
):
    """Create our MQTT client. The client_id is a unique string that identifies
    this device. For Google Cloud IoT Core, it must be in the format below."""
    client_id = "projects/{}/locations/{}/registries/{}/devices/{}".format(
        project_id, cloud_region, registry_id, device_id
    )
    print("Device client_id is '{}'".format(client_id))

    client = mqtt.Client(client_id=client_id)

    # With Google Cloud IoT Core, the username field is ignored, and the
    # password field is used to transmit a JWT to authorize the device.
    client.username_pw_set(
        username="unused", password=create_jwt(project_id, private_key_file, algorithm)
    )

    # Enable SSL/TLS support.
    client.tls_set(ca_certs=ca_certs, tls_version=ssl.PROTOCOL_TLSv1_2)

    # Register message callbacks. https://eclipse.org/paho/clients/python/docs/
    # describes additional callbacks that Paho supports. In this example, the
    # callbacks just print to standard out.
    client.on_connect = on_connect
    client.on_publish = on_publish
    client.on_disconnect = on_disconnect
    client.on_message = on_message

    # Connect to the Google MQTT bridge.
    client.connect(mqtt_bridge_hostname, mqtt_bridge_port)

    # This is the topic that the device will receive configuration updates on.
    mqtt_config_topic = "/devices/{}/config".format(device_id)

    # Subscribe to the config topic.
    print("Subscribing to {}".format(mqtt_config_topic))
    client.subscribe(mqtt_config_topic, qos=1)

    # The topic that the device will receive commands on.
    mqtt_command_topic = "/devices/{}/commands/#".format(device_id)

    # Subscribe to the commands topic, QoS 1 enables message acknowledgement.
    print("Subscribing to {}".format(mqtt_command_topic))
    client.subscribe(mqtt_command_topic, qos=0)

    return client


def mqtt_device_demo(
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
    # [START iot_mqtt_run]
    global config

    # Publish to the events or state topic based on the flag.
    sub_topic = "events" if message_type == "event" else "state"

    mqtt_topic = "/devices/{}/{}".format(device_id, sub_topic)

    jwt_iat = datetime.datetime.utcnow()
    jwt_exp_mins = jwt_expires_minutes
    client = get_client(
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

    audio = pyaudio.PyAudio()

    DEVICE_INDEX = 0
    CHUNK = 1024
    FORMAT = pyaudio.paInt16  # 16bit
    CHANNELS = 1  # monaural
    RATE = 48000  # sampling frequency [Hz]
    THRESHOLD = 3000

    stream = audio.open(
        format=FORMAT,
        channels=CHANNELS,
        rate=RATE,
        input=True,
        input_device_index=DEVICE_INDEX,
        frames_per_buffer=CHUNK,
    )

    start = time.time()
    records = []

    while True:
        client.loop()

        data = stream.read(CHUNK, exception_on_overflow=False)
        x = np.frombuffer(data, dtype="int16")

        now = datetime.datetime.fromtimestamp(time.time())
        sound_size = x.max()
        records.append(x.max())

        now = time.time()
        if now - start > 1.0:
            data = create_message(device_id, start, now, records, config)
            print(data)
            start = now
            records = []
            payload = json.dumps(data)

            seconds_since_issue = (datetime.datetime.utcnow() - jwt_iat).seconds
            if seconds_since_issue > 60 * jwt_exp_mins:
                print("Refreshing token after {}s".format(seconds_since_issue))
                jwt_iat = datetime.datetime.utcnow()
                client.loop()
                client.disconnect()
                client = get_client(
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

            if config["sensor_enabled"]:
                client.publish(mqtt_topic, payload, qos=1)

    stream.stop_stream()
    stream.close()
    audio.terminate()


def create_message(device_id, start, now, records, config):
    return {
        "device": {"id": device_id},
        "data": {
            "start": datetime.datetime.fromtimestamp(start).isoformat(),
            "end": datetime.datetime.fromtimestamp(now).isoformat(),
            "max": np.max(records).item(),
            "min": np.min(records).item(),
            "average": np.mean(records).astype("int").item(),
        },
        "config": config,
    }


def main():
    algorithm = "RS256"
    ca_certs = "roots.pem"
    cloud_region = os.environ.get("REGION")
    device_id = os.environ.get("DEVICE_ID")
    jwt_expires_minutes = 20
    listen_dur = 60
    message_type = "event"
    mqtt_bridge_hostname = "mqtt.googleapis.com"
    mqtt_bridge_port = 8883
    private_key_file = "rsa_private.pem"
    project_id = os.environ.get("PROJECT_ID")
    registry_id = os.environ.get("REGISTRY_ID")

    mqtt_device_demo(
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


if __name__ == "__main__":
    main()
