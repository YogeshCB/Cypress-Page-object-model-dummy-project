#!/usr/bin/env bash

APP_NAME=$1
BUILD_TYPE=$2
PORT=$3

PORT_TYPE="NODE_PORT"

if [ "$BUILD_TYPE" = "production" ]; then
  PORT_TYPE="NODE_SECURE_PORT"
fi

source ./variables.sh

sed \
  -e "s/{{DEPLOYMENT_DIRECTORY}}/${DEPLOYMENT_DIRECTORY}/g"\
  -e "s/{{CURRENT_DIRECTORY}}/$(echo $CURRENT_DIRECTORY | sed -e 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g')/g" \
  -e "s/{{BUILD_TYPE}}/${BUILD_TYPE}/g" \
  -e "s/{{PORT_TYPE}}/${PORT_TYPE}/g" \
  -e "s/{{PORT}}/${PORT}/g" \
  $PM2_TEMPLATE > $PM2_CONFIG

pm2 start $PM2_CONFIG --only $DEPLOYMENT_DIRECTORY
