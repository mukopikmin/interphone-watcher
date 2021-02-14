#! /bin/sh

set -ex

region=asia-northeast2
runtime=nodejs10

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
  --entry-point sendInterphoneCommand \
  send-interphone-command

gcloud functions deploy \
  --trigger-topic interphone \
  --runtime $runtime \
  --region $region \
  --entry-point storeInterphoneTelemetry \
  store-interphone-telemetry