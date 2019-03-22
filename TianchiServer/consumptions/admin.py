from django.contrib import admin

from consumptions.models import Consumption


@admin.register(Consumption)
class ConsumptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'cost', 'created_at')
    search_fields = ('student__name', 'student__id')
