def calculate_cache_key(view_instance, view_method,
                        request, args, kwargs):
    url = '{}?'.format(request.path)
    for key in request.query_params:
        url += '{}={}&'.format(key, request.query_params[key])
    return url


ONE_MONTH = 30 * 24 * 60 * 60
ONE_WEEK = 7 * 24 * 60 * 60
