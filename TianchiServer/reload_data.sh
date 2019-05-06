#!/bin/bash
kill -9 `lsof -l | grep 'TCP\ \*:8000' | tail -n 1 | awk '{print $2}'` ||
docker exec -it 42d95f4bcb40 psql -U postgres -c 'DROP DATABASE tianchidb;' &&
docker exec -i 42d95f4bcb40 psql -U postgres -c 'CREATE DATABASE tianchidb;' &&
docker exec -i 42d95f4bcb40 psql -U postgres -c 'GRANT ALL PRIVILEGE ON DATABASE tianchidb TO tianchiuser;' &&
cat ~/tianchi-data-newest.sql | docker exec -i 42d95f4bcb40 psql -U tianchiuser tianchidb &&
cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/TianchiServer &&
source env/bin/activate &&
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ -r requirements.txt &&
nohup python manage.py runserver 0.0.0.0:8000 > server.log &&
deactivate &&

