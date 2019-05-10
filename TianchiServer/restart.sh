#!/bin/bash
kill -9 `lsof -l | grep 'TCP\ \*:8000' | tail -n 1 | awk '{print $2}'` &&
cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/TianchiServer &&
source env/bin/activate &&
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ -r requirements.txt &&
nohup python manage.py runserver 0.0.0.0:8000 > server.log & &&
deactivate &&
