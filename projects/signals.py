from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Milestone

@receiver([post_save, post_delete], sender=Milestone)
def update_project_progress(sender, instance, **kwargs):
    # Update project's progress, when a milestone assigned to it, changes
    instance.project.update_progress()