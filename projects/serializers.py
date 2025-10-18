from rest_framework import serializers
from .models import Project, Milestone, TeamRoster, RecentActivityEvent

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'project', 'title', 'description', 'due_date', 'progress', 'weight']

class TeamRosterSerializer(serializers.ModelSerializer):
    projects = serializers.PrimaryKeyRelatedField(many=True, queryset=Project.objects.all())
    
    class Meta:
        model = TeamRoster
        fields = ['id', 'name', 'role', 'capacity_percent', 'projects']

class RecentActivityEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentActivityEvent
        fields = ['id', 'project', 'created_by', 'description', 'created_at']
        read_only_field = ['created_at']

class ProjectSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    team = TeamRosterSerializer(many=True, read_only=True)
    events = RecentActivityEventSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'short_description', 'owner', 'last_updated', 'progress',
            'tags', 'health', 'status', 'deleted', 'version',
            'milestones', 'team', 'events']
        read_only_field = ['last_updated']
