#!/usr/bin/env bash

#$APP_NAME - Injected by Circle CI. Name of the app being built. Values - app(kubric-web) or publisher(kubric-publisher)
#$BUILD_TYPE - Injected by Circle CI. Envt for which the build is being run. Values - release(beta.kubric.io) or production(kubric.io)
#$DEPLOYMENT_SERVER - Injected by Circle CI. IP of the server to which deployment has to be done
#$PORT - Injected by Circle CI. Port where the node app has to run

source ./variables.sh

DEPLOY_USER=deploy@$DEPLOYMENT_SERVER

CURRENT_PATH=$DEPLOY_USER:$CURRENT_DIRECTORY

#This script is executed from the scripts directory. Moving back one level will put it in the checked out repo directory
cd ..

#Packing checked out branch. Does not pack yarn.lock, .npmrc or node_modules
tar -cjvf $TARFILE .

#Copying prebuild and variables scripts to the deployment server into the deploy user's home directory /home/deploy
scp -o StrictHostKeyChecking=no scripts/$PREBUILD_SCRIPT $DEPLOY_USER:~/$ENVT_PREBUILD_SCRIPT
scp -o StrictHostKeyChecking=no scripts/$VARIABLES_SCRIPT $DEPLOY_USER:~/$ENVT_VARIABLES_SCRIPT

#Executing copied prebuild script in the deployment server passing it the parameters $APP_NAME and $BUILD_TYPE
ssh -o StrictHostKeyChecking=no $DEPLOY_USER "chmod 777 ${ENVT_PREBUILD_SCRIPT} && chmod 777 ${ENVT_VARIABLES_SCRIPT} && source ${ENVT_PREBUILD_SCRIPT} ${APP_NAME} ${BUILD_TYPE} ${ENVT_VARIABLES_SCRIPT}"

#Copying build, variables and pm2 scripts to the deployment directory
scp -o StrictHostKeyChecking=no scripts/$BUILD_SCRIPT $DEPLOY_USER:~/$DEPLOYMENT_DIRECTORY
scp -o StrictHostKeyChecking=no scripts/$VARIABLES_SCRIPT $DEPLOY_USER:~/$DEPLOYMENT_DIRECTORY
scp -o StrictHostKeyChecking=no scripts/$PM2_SCRIPT $DEPLOY_USER:~/$DEPLOYMENT_DIRECTORY

#Copying packaged branch tar file to the deployment directory
scp -o StrictHostKeyChecking=no $TARFILE $DEPLOY_USER:$DEPLOYMENT_DIRECTORY

#Unpacking copied tar file in the deployment directory, under CURRENT_DIRECTORY folder on the deployment server.
ssh -o StrictHostKeyChecking=no $DEPLOY_USER "cd ${DEPLOYMENT_DIRECTORY} && mkdir ${CURRENT_DIRECTORY_NAME} && tar -xjvf ${TARFILE} -C ${CURRENT_DIRECTORY_NAME}"

#Making the build script executable on the deployment server and executing it
ssh -o StrictHostKeyChecking=no $DEPLOY_USER "cd ${DEPLOYMENT_DIRECTORY} && chmod 777 ${BUILD_SCRIPT} && chmod 777 ${VARIABLES_SCRIPT} && chmod 777 ${PM2_SCRIPT} && source ${BUILD_SCRIPT} ${APP_NAME} ${BUILD_TYPE} ${PORT}"
