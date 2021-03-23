#! /bin/sh

set -ex

region=asia-northeast2
runtime=nodejs12

gcloud functions deploy \
  --trigger-topic interphone \
  --runtime $runtime \
  --region $region \
  --entry-point notifyInterphoneSlack \
  notify-interphone-slack

gcloud functions deploy \
  --trigger-http \
  --runtime $runtime \
  --region $region \
  --entry-point stopInterphoneWatch \
  stop-interphone-watch

gcloud functions deploy \
  --trigger-topic interphone \
  --runtime $runtime \
  --region $region \
  --entry-point storeInterphoneTelemetry \
  store-interphone-telemetry