from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Utilisateur


class UtilisateurSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=False)
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    date_naissance = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'first_name', 'last_name', 'date_naissance',
                  'email', 'password', 'avatar', 'role',
                  'confirm_password', 'current_password', 'new_password']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': False},
            'avatar': {'required': False}
        }

    def validate(self, data):
        # Validation du changement de mot de passe
        if data.get('new_password'):
            # Vérifier que le mot de passe actuel est fourni et correct
            user = self.instance
            if not data.get('current_password'):
                raise serializers.ValidationError({
                    "current_password": "Le mot de passe actuel est requis pour changer de mot de passe"
                })

            if not user.check_password(data['current_password']):
                raise serializers.ValidationError({
                    "current_password": "Le mot de passe actuel est incorrect"
                })

            # Vérifier la correspondance des mots de passe
            if data.get('new_password') != data.get('confirm_password'):
                raise serializers.ValidationError({
                    "confirm_password": "Les mots de passe ne correspondent pas"
                })

        return data

    # AJOUT DE LA MÉTHODE CREATE POUR RENDRE TOUS LES UTILISATEURS ACTIFS PAR DÉFAUT
    def create(self, validated_data):
        # Supprimer les champs de validation de mot de passe
        validated_data.pop('confirm_password', None)
        validated_data.pop('current_password', None)
        validated_data.pop('new_password', None)

        # Récupérer le mot de passe
        password = validated_data.pop('password', None)

        # Créer l'utilisateur avec tous les champs sauf le mot de passe
        # Et s'assurer qu'il est actif quel que soit son rôle
        validated_data['is_active'] = True  # CECI EST LA MODIFICATION CLÉ

        utilisateur = Utilisateur(**validated_data)

        # Définir le mot de passe hashé
        if password:
            utilisateur.set_password(password)

        utilisateur.save()
        return utilisateur

    def update(self, instance, validated_data):
        # Supprimer les champs temporaires
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)
        validated_data.pop('confirm_password', None)

        # Mettre à jour les autres champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Changer le mot de passe si un nouveau est fourni
        if new_password:
            instance.set_password(new_password)

        instance.save()
        return instance


# Serializer pour obtenir le token JWT
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['nom'] = self.user.last_name
        data['prenom'] = self.user.first_name
        return data