#! /bin/sh

# Generate RSA256-X509 device key pair
# https://cloud.google.com/iot/docs/quickstart

set -ex

output_dir=keys

mkdir -p $output_dir

openssl req \
    -x509 \
    -newkey rsa:2048 \
    -keyout $output_dir/rsa_private.pem \
    -nodes \
    -out $output_dir/rsa_cert.pem \
    -subj "/CN=unused"