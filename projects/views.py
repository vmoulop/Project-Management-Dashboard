from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Milestone, TeamRoster, RecentActivityEvent
from .serializers import ProjectSerializer, MilestoneSerializer, TeamRosterSerializer, RecentActivityEventSerializer
from django.contrib.postgres.search import SearchQuery
from django.db import transaction

# ViewSet for Project model
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    # Filtering by status, owner, tags, health
    filterset_fields = ['status', 'owner', 'tags', 'health']
    # Ordering by last_updated, status, owner, tags, health
    ordering_fields = ['last_updated', 'status', 'owner', 'tags', 'health']

    # By default (without filtering) show only non-deleted projects, ordered by last_updated descending
    def get_queryset(self):
        qs = Project.objects.filter(deleted=False).order_by('-last_updated')
        search_param = self.request.query_params.get('search', None)
        if search_param:
            query = SearchQuery(search_param)
            qs = qs.filter(search_vector=query)
        return qs
    
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
    
    # Bulk update status or tags for multiple projects
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        project_ids = request.data.get('project_ids', [])
        new_status = request.data.get('status')
        new_tags = request.data.get('tags')
        client_version = request.data.get('version')

        if not project_ids:
            return Response({"detail": "No project_ids provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch all projects
        projects = Project.objects.filter(id__in=project_ids)

        # Optimistic concurrency check
        if client_version is not None:
            for project in projects:
                if project.version != client_version:
                    return Response(
                        {"detail": f"Project {project.id} version mismatch."},
                        status=status.HTTP_409_CONFLICT
                    )

        # All database operations below are treated as a single transaction (atomic update)
        try:
            with transaction.atomic():
                for project in projects:
                    if new_status:
                        project.status = new_status
                    if new_tags is not None:
                        project.tags = new_tags
                    # Increment version after successful update
                    project.version += 1
                    project.save()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "Projects updated successfully."}, status=status.HTTP_200_OK)

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