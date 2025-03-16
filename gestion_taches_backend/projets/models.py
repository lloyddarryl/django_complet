from django.db import models
from django.conf import settings

class Projet(models.Model):
    STATUT_CHOIX = [
        ('À faire', 'À faire'),
        ('En cours', 'En cours'),
        ('Terminé', 'Terminé'),
    ]

    nom = models.CharField(max_length=255)
    description = models.TextField(default="Aucune description")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_limite = models.DateField(null=True, blank=True)
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOIX,
        default='À faire'
    )
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projets'
    )

    def __str__(self):
        return self.nom