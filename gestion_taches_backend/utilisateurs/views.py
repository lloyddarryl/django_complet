from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Utilisateur
from .serializers import UtilisateurSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth.hashers import check_password


class UtilisateurViewSet(ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['PUT'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)

        try:
            # Validation manuelle du mot de passe
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')

            # Vérification du changement de mot de passe
            if new_password:
                # Vérifier le mot de passe actuel
                if not current_password:
                    return Response(
                        {'errors': {
                            'current_password': ['Le mot de passe actuel est requis pour changer de mot de passe']}},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Vérifier que le mot de passe actuel est correct
                if not check_password(current_password, user.password):
                    return Response(
                        {'errors': {'current_password': ['Le mot de passe actuel est incorrect']}},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Vérifier la correspondance des nouveaux mots de passe
                if new_password != confirm_password:
                    return Response(
                        {'errors': {'confirm_password': ['Les mots de passe ne correspondent pas']}},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Validation et sauvegarde
            if serializer.is_valid(raise_exception=True):
                utilisateur = serializer.save()
                return Response(
                    self.get_serializer(utilisateur).data,
                    status=status.HTTP_200_OK
                )
        except Exception as e:
            # Gestion des erreurs de validation
            return Response(
                {'errors': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ici c une vue personnalisée pour le token JWT
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# là pour l'inscription d'un utilisateur
class InscriptionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                try:
                    # MODIFICATION: Assurez-vous que l'utilisateur est actif
                    utilisateur = serializer.save(is_active=True)
                    return Response(
                        UtilisateurSerializer(utilisateur).data,
                        status=status.HTTP_201_CREATED
                    )
                except Exception as e:
                    return Response(
                        {'errors': {'non_field_errors': [str(e)]}},
                        status=status.HTTP_400_BAD_REQUEST
                    )
        except Exception as e:
            # pour pouvoir lire les erreurs du serializer
            error_details = {}
            for key, value in serializer.errors.items():
                error_details[key] = value[0] if isinstance(value, list) else value

            return Response(
                {'errors': error_details},
                status=status.HTTP_400_BAD_REQUEST
            )