#!/bin/bash
cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/tianchi-client &&
git pull origin master &&
yarn install &&
yarn build &&
yarn docker-hub:build &&
docker stop tianchi-client &&
docker rm tianchi-client &&
docker run -d -p 80:80 tianchi-client --name tianchi-client
