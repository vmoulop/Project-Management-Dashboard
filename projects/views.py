from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Milestone, TeamRoster, RecentActivityEvent
from .serializers import ProjectSerializer, MilestoneSerializer, TeamRosterSerializer, RecentActivityEventSerializer

# ViewSet for Project model
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    # Filtering by status, owner, tags, health
    filterset_fields = ['status', 'owner', 'tags', 'health']
    # Ordering by last_updated, status, owner, tags, health
    ordering_fields = ['last_updated', 'status', 'owner', 'tags', 'health']

    # By default show only non-deleted projects, ordered by last_updated descending
    def get_queryset(self):
        return Project.objects.filter(deleted=False).order_by('-last_updated')
    
    # Override default destroy to support soft delete
    def destroy(self, request, *args, **kwargs):
        project = self.get_object()
        if project.deleted:
            return Response({"detail": "Project is already deleted."}, status=status.HTTP_400_BAD_REQUEST)
        project.deleted = True
        project.save(update_fields=['deleted', 'last_updated'])
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    # Recover a soft-deleted project
    @action(detail=True, methods=['post'])
    def recover(self, request, pk=None):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if not project.deleted:
            return Response({"detail": "Project is not deleted."}, status=status.HTTP_400_BAD_REQUEST)

        project.deleted = False
        project.save(update_fields=['deleted', 'last_updated'])
        return Response(self.get_serializer(project).data)
    
# ViewSet for Milestone model
class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all().order_by('due_date')
    serializer_class = MilestoneSerializer

# ViewSet for TeamRoster model
class TeamRosterViewSet(viewsets.ModelViewSet):
    queryset = TeamRoster.objects.all().order_by('name')
    serializer_class = TeamRosterSerializer

# ViewSet for RecentActivityEvent model
class RecentActivityEventViewSet(viewsets.ModelViewSet):
    queryset = RecentActivityEvent.objects.all().order_by('-created_at')
    serializer_class = RecentActivityEventSerializer