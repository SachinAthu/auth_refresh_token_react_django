from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey(User, related_name="Notes", on_delete=models.CASCADE, null=True)
    body = models.TextField(max_length=10000)
