from django.db import models
from utilisateurs.models import Utilisateur
from projets.models import Projet

class Tache(models.Model):
    STATUT_CHOIX = [
        ('À faire', 'À faire'),
        ('En cours', 'En cours'),
        ('Terminé', 'Terminé'),
    ]

    nom = models.CharField(max_length=200)  # Changé de titre à nom
    description = models.TextField(blank=True, null=True)
    date_limite = models.DateField()
    date_creation = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOIX, default='À faire')
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='taches')
    assignee = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.nom