from django.contrib import admin

from terms.models import Term


@admin.register(Term)
class TermAdmin(admin.ModelAdmin):
    list_display = ('id', '__unicode__')
