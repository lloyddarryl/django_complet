from rest_framework import serializers
from .models import Tache
from utilisateurs.models import Utilisateur
from projets.models import Projet

class TacheSerializer(serializers.ModelSerializer):
    # permettre de choisir l'utilisateur assigné dans la requête
    assignee = serializers.PrimaryKeyRelatedField(queryset=Utilisateur.objects.all(), required=False)
    projet = serializers.PrimaryKeyRelatedField(queryset=Projet.objects.all())

    class Meta:
        model = Tache
        fields = '__all__'
        read_only_fields = ['date_creation']