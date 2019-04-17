from rest_framework import serializers

from terms.models import Term


class TermMapSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Term
        fields = ('id', 'name')

    def get_name(self, instance):
        return '{}-{} 第{}学期'.format(
            instance.start_year,
            instance.end_year,
            instance.order,
        )
