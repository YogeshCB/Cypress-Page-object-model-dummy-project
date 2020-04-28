#!/usr/bin/env bash

APP_NAME=$1
BUILD_TYPE=$2
VARIABLES_SCRIPT=$3

#Adds common variables from the variables script
source ./$VARIABLES_SCRIPT

pm2 stop $DEPLOYMENT_DIRECTORY

# 1. If it is the first deployment, $DEPLOYMENT_DIRECTORY will not exist. In that case, just create the $DEPLOYMENT_DIRECTORY and exit
# 2. If it is the second deployment, $DEPLOYMENT_DIRECTORY and $CURRENT_DIRECTORY(with the active deployment) will exist. In that case, rename the $CURRENT_DIRECTORY as the $PREVIOUS_DIRECTORY to save the previous deployment as backup and exit
# 3. If it has been deployed more than 2 times, $DEPLOYMENT_DIRECTORY and $CURRENT_DIRECTORY(with the active deployment) and $PREVIOUS_DIRECTORY(with the backup) will exist. In that case, remove the $PREVIOUS_DIRECTORY, rename the $CURRENT_DIRECTORY as the $PREVIOUS_DIRECTORY and exit
if [ ! -d "$DEPLOYMENT_DIRECTORY" ]; then
  mkdir "$DEPLOYMENT_DIRECTORY"
  echo "Created new directory $DEPLOYMENT_DIRECTORY"
  echo "DONE"
  exit 0
elif [ -d "$CURRENT_DIRECTORY" ]; then
  if [ -d "$PREVIOUS_DIRECTORY" ]; then
    rm -rf "$PREVIOUS_DIRECTORY"
    echo "Removed previous deployment"
  fi
  mv $CURRENT_DIRECTORY $PREVIOUS_DIRECTORY
  echo "Saved current deployment as previous"
  echo "DONE"
  exit 0
fi

echo "DONE"
exit 0