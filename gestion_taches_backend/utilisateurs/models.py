from django.contrib.auth.models import AbstractUser
from django.db import models


class Utilisateur(AbstractUser):
    # champ 'role' avec le choix entre les options
    ROLE_CHOICES = (
        ('ETUDIANT', 'Étudiant'),
        ('PROFESSEUR', 'Professeur'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ETUDIANT')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    date_naissance = models.DateField(null=True, blank=True)

    #  permissions et groupes
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="utilisateur_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="utilisateur_permissions",
        blank=True
    )

    def __str__(self):
        return self.username
