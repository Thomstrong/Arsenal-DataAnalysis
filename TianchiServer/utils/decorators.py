import json
import time
from functools import wraps

from django.db import connection, reset_queries
from django.utils.decorators import available_attrs
from rest_framework.response import Response


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
                print(json.dumps(connection.queries, indent=2))
            print('------------------------------------')
            return result

        return wrapper

    return decorator


def required_params(check='query_params', params=[]):
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(instance, request, *args, **kwargs):
            data_set = request.query_params if check == 'query_params' else request.data

            for param in params:
                if param not in data_set:
                    return Response({'detail': u'需要参数{0}'.format(param)}, status=400)

            return view_func(instance, request, *args, **kwargs)

        return _wrapped_view
    return decorator
