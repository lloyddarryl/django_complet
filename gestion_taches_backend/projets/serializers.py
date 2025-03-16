from rest_framework import serializers
from .models import Projet

class ProjetSerializer(serializers.ModelSerializer):
    # mets le champ utilisateur en lecture seule
    utilisateur = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Projet
        fields = '__all__'
        read_only_fields = ['date_creation']