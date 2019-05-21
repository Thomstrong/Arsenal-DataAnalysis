#!/bin/bash
cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/tianchi-client &&
export NODE_ENV=production &&

echo "git fetching"
git fetch origin master
if [ $? == 0 ];then
    echo "git fetch success"
else
    echo "git fetch failed"
    exit 1
fi

# test
if [ $(git diff master origin/master --name-only --oneline | grep ^requirements\.txt$ | wc -l) == 1 ]; then
    pip_update=1
fi

if [ $(git diff master origin/master --name-only --oneline | grep ^package\.json$ | wc -l) == 1 ]; then
    npm_update=1
fi

if [ $(git diff master origin/master --name-only --oneline | grep ^javascripts/.*$ | wc -l) != 0 ]; then
    js_update=1
fi

# rebase code
git rebase origin/master
echo "git rebasing"
if [ $? == 0 ];then
    echo "git rebase success"
else
    echo "git rebase failed"
    exit 1
fi

# pip
if [ $pip_update ]; then
    echo "pip installing"
    cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/TianchiServer &&
    source env/bin/activate &&
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ -r requirements.txt &&
    deactivate &&
    cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/tianchi-client
else
    echo "no changed detected in requirements.txt, skipping"
fi

# npm
if [ $npm_update ]; then
    echo "yarn installing"
    yarn install && yarn build
elif [ $js_update ]; then
    echo "yarn building"
    yarn build
else
    echo "no changed detected in package.json or javascript files, skipping"
fi

yarn docker-hub:build &&
docker stop tianchi-client &&
docker rm tianchi-client &&
docker run -d -p 80:80 --name tianchi-client tianchi-client &&
docker rmi $(docker images | grep "none" | awk '{print $3}')
