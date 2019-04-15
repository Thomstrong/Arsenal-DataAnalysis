from django.conf.urls import include, url
from django.contrib import admin
from django.urls import path

from .routers import router

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
]
