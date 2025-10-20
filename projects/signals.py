from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Milestone, RecentActivityEvent
from django_eventstream import send_event
from django.contrib.postgres.search import SearchVector
from .models import Project

@receiver([post_save, post_delete], sender=Milestone)
def update_project_progress(sender, instance, **kwargs):
    project = instance.project
    # Update project's progress, when a milestone assigned to it, changes
    project.update_progress()

    # Push real-time SSE update when the progress of a project is updated
    send_event('projects', 'message', {
        'type': 'progress_update',
        'project_id': project.id,
        'progress': float(project.progress),
    })

@receiver(post_save, sender=RecentActivityEvent)
def send_new_activity_event(sender, instance, **kwargs):
    # Push real-time SSE update when a new activity event is created
    send_event('activities', 'message', {
        'type': 'new_activity',
        'project_id': instance.project.id,
        'description': instance.description,
        'created_by': instance.created_by,
        'created_at': instance.created_at.isoformat(),
    })

@receiver(post_save, sender=Project)
def update_search_vector(sender, instance, **kwargs):
    # Update search vector only after the object exists
    Project.objects.filter(pk=instance.pk).update(
        search_vector=(
            SearchVector('title', weight='A') +
            SearchVector('short_description', weight='B') +
            SearchVector('tags', weight='C')
        )
    )