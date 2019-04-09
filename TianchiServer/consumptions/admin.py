from django.contrib import admin

from consumptions.models import Consumption, DailyConsumption, HourlyConsumption


@admin.register(Consumption)
class ConsumptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'cost', 'created_at')
    search_fields = ('student__name', 'student__id')


@admin.register(DailyConsumption)
class ConsumptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'total_cost', 'date',)
    search_fields = ('student__name', 'student__id')
    list_filter = ('student__name', 'date',)


@admin.register(HourlyConsumption)
class ConsumptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'hour', 'total_cost', 'date',)
    search_fields = ('student__name', 'student__id')
    list_filter = ('student__name', 'date', 'hour')
