# Create your views here.
from rest_framework import viewsets

from terms.api.serializers import TermMapSerializer
from terms.models import Term


class TermViewSet(viewsets.ModelViewSet):
    queryset = Term.objects.all()
    serializer_class = TermMapSerializer
