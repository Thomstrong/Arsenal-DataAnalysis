import numpy as np
from sklearn.linear_model import LinearRegression


class Predictor(object):
    @staticmethod
    def bayes_predict(cost_x, cost_y, tody_cost):
        # 转化数据结构，使其满足sklearn函数要求
        cost_x = np.array(cost_x)
        cost_y = np.array(cost_y)
        clf = LinearRegression()
        clf.fit(cost_x, cost_y)
        # 训练数据的预测值
        tomorrow_pre = clf.predict(np.array([tody_cost]))
        return tomorrow_pre[0]
