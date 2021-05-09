#! /bin/sh

# Generate RSA256-X509 device key pair
# https://cloud.google.com/iot/docs/quickstart

set -ex

key="rsa"

if [ ! "$1" = "" ]; then
    key=$1 
fi

output_dir=keys
mkdir -p $output_dir

openssl req \
    -x509 \
    -newkey rsa:2048 \
    -keyout $output_dir/${key}_private.pem \
    -nodes \
    -out $output_dir/${key}_cert.pem \
    -subj "/CN=unused"

wget https://pki.google.com/roots.pemß