from django.db import models

# Create the Project model
class Project(models.Model):

    # Possible health values for a project
    HEALTH_CHOICES = [
       # Healthy
       ('green', 'Green'),
       # Minor issues
       ('yellow', 'Yellow'),
       # At risk
       ('red', 'Red'),
    ]

    # Possible health statuses for a project
    STATUS_CHOICES = [
       # Not started
       ('not_started', 'Not started'),
       # In progress
       ('in_progress', 'In progress'),
       # On hold
       ('on_hold', 'On hold'),
       # Completed
       ('completed', 'Completed'),
       # Cancelled
       ('cancelled', 'Cancelled'),
    ]

    # Attributes of the Project
    
    # Title
    title = models.CharField(max_length=255)
    
    # Short Description
    short_description = models.TextField(blank=True)
    
    # Project Owner
    owner = models.CharField(max_length=150)

    # Last updated date
    last_updated = models.DateTimeField(auto_now=True)

    # Progress (0.00%-100.00%)
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Tags
    tags = models.JSONField(default=list, blank=True)

    # Health
    health = models.CharField(max_length=10, choices=HEALTH_CHOICES, default='green')

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')

    # Soft delete for recover
    deleted = models.BooleanField(default=False)

    # Optimistic concurrency safeguard (version)
    version = models.IntegerField(default=1)

    def __str__(self):
        # Return the string representation of the Project (its title)
        return self.title
    
# Create the Milestone model
class Milestone(models.Model):
    
    # Relation with Project model
    # Each milestone belongs to one project - ForeignKey to Project models
    project = models.ForeignKey('Project', related_name='milestones', on_delete=models.CASCADE)

    # Attributes of the Milestone

    # Title
    title = models.CharField(max_length=255)
    
    # Description
    description = models.TextField(blank=True)

    # Due date
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
        # Return the project title the Milestone belongs to
        return self.project.title