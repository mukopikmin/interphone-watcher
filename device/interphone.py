import pyaudio
import numpy as np
import time
from scipy.signal import argrelmax
import requests
import json
import datetime
import os
from dotenv import load_dotenv
from utils.iotcore import IoTCore

load_dotenv()

# interphone setting
CHUNK = 1024
SAMPLING_RATE = 44100
dt = 1 / SAMPLING_RATE
freq = np.linspace(0, 1.0 / dt, CHUNK)
fn = 1 / dt / 2

################################################
# Pattern 1
FREQ_HIGH_BASE = 680.0  # high tone frequency
FREQ_LOW_BASE = 847.0  # low tone frequency
################################################
# Pattern 2
# FREQ_HIGH_BASE = 649.0  # high tone frequency
# FREQ_LOW_BASE = 849.0   # low tone frequency

ALLOWABLE_FREQ_ERROR = 0.02


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

    jwt_iat = datetime.datetime.utcnow()
    jwt_exp_mins = jwt_expires_minutes

    audio = pyaudio.PyAudio()
    stream = audio.open(
        format=pyaudio.paInt16,
        channels=1,
        rate=SAMPLING_RATE,
        frames_per_buffer=CHUNK,
        input=True,
        output=False,
    )
    count_h = 0
    count_l = 0
    detect_high = False
    detect_low = False

    while stream.is_active():
        iotcore.client.loop()

        try:
            input = stream.read(CHUNK, exception_on_overflow=False)
            ndarray = np.frombuffer(input, dtype="int16")
            abs_array = np.abs(ndarray) / 32768

            # print(abs_array.max())
            # print(count_h)

            if abs_array.max() > iotcore.sound_volume:
                freq_max = get_max_freq_fft(ndarray, CHUNK, freq)
                print("Max amplitude frequency: ", freq_max, "Hz")

                h, l = detect_dual_tone_in_octave(
                    freq_max, FREQ_HIGH_BASE, FREQ_LOW_BASE, ALLOWABLE_FREQ_ERROR
                )

                if h:
                    detect_high = True
                    print(datetime.datetime.now())
                    print("High tone sound detected.")
                if l:
                    detect_low = True
                    print(datetime.datetime.now())
                    print("Low tone sound detected.")

                # dual tone detected
                if detect_high and detect_low:
                    notify(
                        f"max: {abs_array.max()} counth: {count_h} countl: {count_l}"
                    )
                    print(
                        f"Interphone sound has been detected st {datetime.datetime.now()}."
                    )

                    if iotcore.interphone_enabled:
                        payload = {
                            "deviceId": device_id,
                            "volume": abs_array.max(),
                            "pattern": {"high": FREQ_HIGH_BASE, "low": FREQ_LOW_BASE},
                        }
                        print(payload)
                        iotcore.client.publish(mqtt_topic, json.dumps(payload), qos=1)

                    time.sleep(10)
                    print("Reset state.")
                    detect_high = detect_low = False

            if detect_high:
                count_h += 1

            if detect_low:
                count_l += 1

            if count_h > 50:
                detect_high = False
                count_h = 0
                print(datetime.datetime.now())
                print("Reset high")

            if count_l > 50:
                detect_low = False
                count_l = 0
                print(datetime.datetime.now())
                print("Reset low")

            seconds_since_issue = (datetime.datetime.utcnow() - jwt_iat).seconds
            if seconds_since_issue > 60 * jwt_exp_mins:
                print("Refreshing token after {}s".format(seconds_since_issue))
                jwt_iat = datetime.datetime.utcnow()
                iotcore.client.loop()
                iotcore.client.disconnect()
                iotcore.renew_client()

        except KeyboardInterrupt:
            break

    stream.stop_stream()
    stream.close()
    audio.terminate()


def notify(data):
    webhook = os.environ.get("INCOMING_WEBHOOK")
    payload = {"text": f"{data} \nInterphone sound has been detected."}
    res = requests.post(webhook, data=json.dumps(payload))

    print(payload)
    print(res.text)

    return res.text


# FFTで振幅最大の周波数を取得する関数
def get_max_freq_fft(sound, chunk, freq):
    # FFT
    f = np.fft.fft(sound) / (chunk / 2)
    f_abs = np.abs(f)
    # ピーク検出
    peak_args = argrelmax(f_abs[: (int)(chunk / 2)])
    f_peak = f_abs[peak_args]
    f_peak_argsort = f_peak.argsort()[::-1]
    peak_args_sort = peak_args[0][f_peak_argsort]
    # 最大ピークをreturn
    return freq[peak_args_sort[0]]


# 検知した周波数がインターホンの音の音か判定する関数
def detect_dual_tone_in_octave(freq_in, freq_high_base, freq_low_base, freq_err):
    det_h = det_l = False
    # 検知した周波数が高音・低音のX倍音なのか調べる
    octave_h = freq_in / freq_high_base
    octave_l = freq_in / freq_low_base
    near_oct_h = round(octave_h)
    near_oct_l = round(octave_l)
    if near_oct_h == 0 or near_oct_l == 0:
        return False, False
    # X倍音のXが整数からどれだけ離れているか
    err_h = np.abs((octave_h - near_oct_h) / near_oct_h)
    err_l = np.abs((octave_l - near_oct_l) / near_oct_l)

    # 基音、２倍音、３倍音の付近であればインターホンの音とする
    if err_h < freq_err:
        det_h = True
    elif err_l < freq_err:
        det_l = True

    return det_h, det_l


if __name__ == "__main__":
    algorithm = "RS256"
    ca_certs = "keys/roots.pem"
    cloud_region = os.environ.get("REGION")
    device_id = os.environ.get("DEVICE_ID")
    jwt_expires_minutes = 20
    message_type = "event"
    mqtt_bridge_hostname = "mqtt.googleapis.com"
    mqtt_bridge_port = 8883
    private_key_file = "keys/rsa_private.pem"
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
