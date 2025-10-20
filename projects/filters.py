import django_filters
from django.db.models import JSONField
from .models import Project

class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = {
            'status': ['exact'],
            'owner': ['exact'],
            'health': ['exact'],
        }
        # Add custom filter overrides for JSONField
        filter_overrides = {
            JSONField: {
                'filter_class': django_filters.CharFilter,
                'extra': lambda f: {
                    'lookup_expr': 'icontains'
                },
            },
        }