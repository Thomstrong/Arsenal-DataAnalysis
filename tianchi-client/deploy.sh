#!/bin/bash
cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/tianchi-client &&
git pull origin master &&
yarn install &&
yarn build &&
docker stop tianchi-client &&
docker rm tianchi-client &&
docker image rm tianchi-client &&
yarn docker-hub:build &&
docker run -d -p 80:80 --name tianchi-client tianchi-client
