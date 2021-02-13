import pyaudio
import wave
import time
import numpy as np
import time
from datetime import datetime
from pprint import pprint

audio = pyaudio.PyAudio()

host_api_count = audio.get_host_api_count()
print("Host API Count = " + str(host_api_count))

for cnt in range(host_api_count):
    pprint(audio.get_host_api_info_by_index(cnt))
    pprint(audio.get_device_info_by_index(cnt))