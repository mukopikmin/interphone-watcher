import datetime
import logging
import ssl
import json
import jwt
import paho.mqtt.client as mqtt

logging.getLogger("googleapiclient.discovery_cache").setLevel(logging.CRITICAL)


class IoTCore:
    def __init__(
        self,
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
        # Connection settings
        self.algorithm = algorithm
        self.ca_certs = ca_certs
        self.cloud_region = cloud_region
        self.device_id = device_id
        self.jwt_expires_minutes = jwt_expires_minutes
        self.message_type = message_type
        self.mqtt_bridge_hostname = mqtt_bridge_hostname
        self.mqtt_bridge_port = mqtt_bridge_port
        self.private_key_file = private_key_file
        self.project_id = project_id
        self.registry_id = registry_id
        self.client = self._get_client()

        # Device configs
        self.interphone_enabled = False
        self.sound_volume = 150
        self.detect_once = False

    def renew_client(self):
        self.client = self._get_client()

    def _create_jwt(self, project_id, private_key_file, algorithm):
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

    def _error_str(self, rc):
        """Convert a Paho error to a human readable string."""
        return "{}: {}".format(rc, mqtt.error_string(rc))

    def _on_connect(self, unused_client, unused_userdata, unused_flags, rc):
        """Callback for when a device connects."""
        print("on_connect", mqtt.connack_string(rc))

    def _on_disconnect(self, unused_client, unused_userdata, rc):
        """Paho callback for when a device disconnects."""
        print("on_disconnect", self._error_str(rc))

    def _on_publish(self, unused_client, unused_userdata, unused_mid):
        """Paho callback when a message is sent to the broker."""

    def _on_message(self, unused_client, unused_userdata, message):
        """Callback when the device receives a message on a subscription."""
        payload = str(message.payload.decode("utf-8"))
        config = json.loads(payload)

        self.interphone_enabled = config["interphoneEnabled"]
        self.sound_volume = config["soundVolume"]
        self.detect_once = config["detectOnce"]

        print(
            "Received message on topic '{}' with Qos {}".format(
                message.topic, str(message.qos)
            )
        )
        print("Updated device configurations.")
        print(f"[interphone_enabled] {self.interphone_enabled}")
        print(f"[sound_volume] {self.sound_volume}")
        print(f"[detect_once] {self.detect_once}")

    def _get_client(self):
        """Create our MQTT client. The client_id is a unique string that identifies
        this device. For Google Cloud IoT Core, it must be in the format below."""
        client_id = "projects/{}/locations/{}/registries/{}/devices/{}".format(
            self.project_id, self.cloud_region, self.registry_id, self.device_id
        )
        print("Device client_id is '{}'".format(client_id))

        client = mqtt.Client(client_id=client_id)

        # With Google Cloud IoT Core, the username field is ignored, and the
        # password field is used to transmit a JWT to authorize the device.
        client.username_pw_set(
            username="unused",
            password=self._create_jwt(
                self.project_id, self.private_key_file, self.algorithm
            ),
        )

        # Enable SSL/TLS support.
        client.tls_set(ca_certs=self.ca_certs, tls_version=ssl.PROTOCOL_TLSv1_2)

        # Register message callbacks. https://eclipse.org/paho/clients/python/docs/
        # describes additional callbacks that Paho supports. In this example, the
        # callbacks just print to standard out.
        client.on_connect = self._on_connect
        client.on_publish = self._on_publish
        client.on_disconnect = self._on_disconnect
        client.on_message = self._on_message

        # Connect to the Google MQTT bridge.
        client.connect(self.mqtt_bridge_hostname, self.mqtt_bridge_port)

        # This is the topic that the device will receive configuration updates on.
        mqtt_config_topic = "/devices/{}/config".format(self.device_id)

        # Subscribe to the config topic.
        print("Subscribing to {}".format(mqtt_config_topic))
        client.subscribe(mqtt_config_topic, qos=1)

        # The topic that the device will receive commands on.
        mqtt_command_topic = "/devices/{}/commands/#".format(self.device_id)

        # Subscribe to the commands topic, QoS 1 enables message acknowledgement.
        print("Subscribing to {}".format(mqtt_command_topic))
        client.subscribe(mqtt_command_topic, qos=0)

        return client
