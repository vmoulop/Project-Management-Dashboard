from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, MilestoneViewSet, TeamRosterViewSet, RecentActivityEventViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'milestones', MilestoneViewSet, basename='milestones')
router.register(r'team', TeamRosterViewSet, basename='team')
router.register(r'events', RecentActivityEventViewSet, basename='events')

urlpatterns = [
    path('', include(router.urls)),
]