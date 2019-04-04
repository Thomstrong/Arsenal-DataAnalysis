import time
from functools import wraps

from django.db import connection, reset_queries
from django.utils.decorators import available_attrs


def performance_analysis(queries_detail=False):
    """Dont use this decorator in production env."""

    def decorator(func):
        @wraps(func, assigned=available_attrs(func))
        def wrapper(*args, **kw):
            reset_queries()
            start = time.clock()
            result = func(*args, **kw)
            end = time.clock()
            print('-----------%s performance-----------' % func.__name__)
            print('time cost: %s' % (end - start))
            print('db query number: %s' % len(connection.queries))

            if queries_detail:
                print(connection.queries)
            print('------------------------------------')
            return result

        return wrapper

    return decorator
