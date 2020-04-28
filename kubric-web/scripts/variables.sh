#!/usr/bin/env bash

#$BUILD_TYPE(release or production) and $APP_NAME(publisher or app) are mandatory
if [ -z "$BUILD_TYPE" ]; then
  echo ERROR: Missing parameter BUILD_TYPE
  exit 1
fi

if [ -z "$APP_NAME" ]; then
  echo ERROR: Missing parameter APP_NAME
  exit 1
fi

#name of the deployment directory for that envt and app combination. Can be found under /home/deploy/$DEPLOYMENT_DIRECTORY
DEPLOYMENT_DIRECTORY=${BUILD_TYPE}-$APP_NAME

#prefix added to prebuild.sh and variables.sh before being copied to /home/deploy. This is done to uniquely identify them if there are multiple builds running the the home directory
SCRIPT_PREFIX=${APP_NAME}_$BUILD_TYPE

#prebuild script(scripts/prebuild.sh) and its envt specific version
PREBUILD_SCRIPT=prebuild.sh
ENVT_PREBUILD_SCRIPT=${SCRIPT_PREFIX}_$PREBUILD_SCRIPT

#build script scripts/build.sh
BUILD_SCRIPT=build.sh

#variables script(scripts/variables.sh) and its envt specific version
VARIABLES_SCRIPT=variables.sh
ENVT_VARIABLES_SCRIPT=${SCRIPT_PREFIX}_$VARIABLES_SCRIPT

#pm2 script(scripts/pm2.sh)
PM2_SCRIPT=pm2.sh

#directory that holds the active deployment
CURRENT_DIRECTORY_NAME=current
CURRENT_DIRECTORY=$DEPLOYMENT_DIRECTORY/$CURRENT_DIRECTORY_NAME

#directory that holds the previous deployment as backup
PREVIOUS_DIRECTORY_NAME=previous
PREVIOUS_DIRECTORY=$DEPLOYMENT_DIRECTORY/$PREVIOUS_DIRECTORY_NAME

#name of the tar file that will be packaged on Circle CI and put on the deployment server
TARFILE=$DEPLOYMENT_DIRECTORY.tar.bz

#name of the file that holds the pm2 configuration in the scripts folder
PM2_TEMPLATE=pm2/config-template.json
PM2_CONFIG=pm2/config.json

#Directory structure for $BUILD_TYPE = release and $APP_NAME=publisher
# /home/deploy/release-publisher/current - current deployment in the release(beta) envt
# /home/deploy/release-publisher/previous - previous deployment in the release(beta) envt
