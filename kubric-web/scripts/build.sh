#!/usr/bin/env bash

APP_NAME=$1
BUILD_TYPE=$2
PORT=$3

source ./variables.sh

#Change to the $DEPLOYMENT_DIRECTORY
cd ~/$DEPLOYMENT_DIRECTORY

#If there has been a previous backup saved in the $PREVIOUS_DIRECTORY, copy node_modules from there to the $CURRENT_DIRECTORY
if [ -d "$PREVIOUS_DIRECTORY_NAME" ]; then
  echo "Copying node_modules from previous deployment"
  cp -r "$PREVIOUS_DIRECTORY_NAME/node_modules" "$CURRENT_DIRECTORY_NAME"
  echo "Copied node_modules from previous deployment"
fi

#Change to the current directory
cd $CURRENT_DIRECTORY_NAME

#Installing modules. Since the previous node_modules have been copied, installation will be done, only if necessary
yarn install --ignore-engines

#Builds the codebase. npm run build-release or npm run build-production based on the $BUILD_TYPE
npm run build-$BUILD_TYPE

#Starts/Restarts the pm2 node process for the current envt/app combination
cd scripts
source ./pm2.sh $APP_NAME $BUILD_TYPE $PORT

#cleanup
cd ../..
rm -f $TARFILE
rm -f $BUILD_SCRIPT
rm -f $VARIABLES_SCRIPT
rm -f $PM2_SCRIPT

cd ..
rm -f $ENVT_PREBUILD_SCRIPT
rm -f $ENVT_VARIABLES_SCRIPT