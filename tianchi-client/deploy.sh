#!/bin/bash
cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/tianchi-client &&
git pull origin master &&
export NODE_ENV=production &&
yarn install &&
yarn build &&
yarn docker-hub:build &&
docker stop tianchi-client &&
docker rm tianchi-client &&
docker run -d -p 80:80 --name tianchi-client tianchi-client &&
docker rmi $(docker images | grep "none" | awk '{print $3}')
