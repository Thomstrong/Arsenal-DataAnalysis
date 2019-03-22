from django.contrib import admin

from kaoqins.models.kaoqin_event import KaoqinEvent
from kaoqins.models.kaoqin_record import KaoqinRecord
from kaoqins.models.kaoqin_type import KaoqinType


@admin.register(KaoqinEvent)
class KaoqinEventAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'event_name',)


@admin.register(KaoqinRecord)
class KaoqinRecordRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'event', 'created_at',)
    search_fields = ('student',)
    list_filter = ('event__event_name',)


@admin.register(KaoqinType)
class KaoqinTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title',)
    search_fields = ('title',)
