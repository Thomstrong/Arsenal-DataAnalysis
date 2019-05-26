import requests
from bs4 import BeautifulSoup
import csv
import pandas as pd

wuliMajor = {}
huaxueMajor = {}
shengwuMajor = {}
lishiMajor = {}
diliMajor = {}
zhengzhiMajor = {}
jishuMajor = {}
buxianMajor = {}
major = []


def getHTML(url):
  r = requests.get(url)
  return r.content


def parseHTML(html):
  soup = BeautifulSoup(html, 'lxml')
  body = soup.body
  company_middle = body.find('div', attrs={'class': 'box780 clearfix'})
  company_list_ct = company_middle.find('div', attrs={'class': 'l_right'})
  company_list_ct1 = company_list_ct.find('div', attrs={'class': 'l_right_cnt'})
  company_list_ct2 = company_list_ct1.find('div', attrs={'class': 'search'})
  company_list_ct3 = company_list_ct2.find('table')

  for company_ul in company_list_ct3.find_all('tr', attrs={'bgcolor': '#FFFFFF'}):
    company_info = []
    for company_li in company_ul.find_all('td', attrs={'align': 'left'}):
      company_info.append(company_li.get_text())
    if '物理' in company_info[1]:
      if company_info[0] not in wuliMajor.keys():
        wuliMajor.update({company_info[0]: 1})
      else:
        wuliMajor[company_info[0]] = wuliMajor[company_info[0]] + 1
    if '化学' in company_info[1]:
      if company_info[0] not in huaxueMajor.keys():
        huaxueMajor.update({company_info[0]: 1})
      else:
        huaxueMajor[company_info[0]] = huaxueMajor[company_info[0]] + 1
    if '生物' in company_info[1]:
      if company_info[0] not in shengwuMajor.keys():
        shengwuMajor.update({company_info[0]: 1})
      else:
        shengwuMajor[company_info[0]] = shengwuMajor[company_info[0]] + 1
    if '地理' in company_info[1]:
      if company_info[0] not in diliMajor.keys():
        diliMajor.update({company_info[0]: 1})
      else:
        diliMajor[company_info[0]] = diliMajor[company_info[0]] + 1
    if '历史' in company_info[1]:
      if company_info[0] not in lishiMajor.keys():
        lishiMajor.update({company_info[0]: 1})
      else:
        lishiMajor[company_info[0]] = lishiMajor[company_info[0]] + 1
    if '思想政治' in company_info[1]:
      if company_info[0] not in zhengzhiMajor.keys():
        zhengzhiMajor.update({company_info[0]: 1})
      else:
        zhengzhiMajor[company_info[0]] = zhengzhiMajor[company_info[0]] + 1
    if '技术' in company_info[1]:
      if company_info[0] not in jishuMajor.keys():
        jishuMajor.update({company_info[0]: 1})
      else:
        jishuMajor[company_info[0]] = jishuMajor[company_info[0]] + 1
    if '不限' in company_info[1]:
      if company_info[0] not in buxianMajor.keys():
        buxianMajor.update({company_info[0]: 1})
      else:
        buxianMajor[company_info[0]] = buxianMajor[company_info[0]] + 1


def herf(html):
  urlList = []
  main_page = BeautifulSoup(html, 'lxml')
  t1 = main_page.find_all('a')
  for t2 in t1:
    t3 = t2.get('href')
    if "html" in t3 and 'http' not in t3:
      urlList.append(url + t3)
  return urlList


URL = 'http://zt.zjzs.net/xk2019/allcollege.html'
url = 'http://zt.zjzs.net/xk2019/'
html = getHTML(URL)
urlList = herf(html)
urlList = urlList[3:]
print(len(urlList))
print(urlList)
for url1 in urlList:
  parseHTML(getHTML(url1))

major.append(wuliMajor)
major.append(huaxueMajor)
major.append(shengwuMajor)
major.append(lishiMajor)
major.append(diliMajor)
major.append(zhengzhiMajor)
major.append(jishuMajor)
major.append(buxianMajor)

pd.DataFrame(major).to_csv('subject2major.csv', encoding='gbk')
