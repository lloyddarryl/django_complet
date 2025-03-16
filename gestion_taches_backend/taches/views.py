from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Tache
from .serializers import TacheSerializer
from rest_framework.response import Response

class TacheViewSet(viewsets.ModelViewSet):
    serializer_class = TacheSerializer
    permission_classes = [IsAuthenticated]
    queryset = Tache.objects.none()

    # le filtre des tâches en fonction de l'utilisateur connecté
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            #  l'uitlisateur voit toutes les tâches
            return Tache.objects.all()
        else:
            # le userr voit les tâches liées à ses projets et celles qui lui sont assignées
            return Tache.objects.filter(projet__utilisateur=user) | Tache.objects.filter(assignee=user)

    # ✅ Associer automatiquement la tâche à un projet de l'utilisateur connecté
    def perform_create(self, serializer):
        projet = serializer.validated_data['projet']

        # ✅ Vérifie que le projet appartient à l'utilisateur ou que l'utilisateur est superuser
        if projet.utilisateur != self.request.user and not self.request.user.is_superuser:
            raise ValidationError("Ce projet n'appartient pas à l'utilisateur connecté.")

        # ✅ Gestion de l'assignation
        assignee = serializer.validated_data.get('assignee', None)
        if assignee:
            # Seul le propriétaire du projet ou le superuser peut assigner une tâche
            if projet.utilisateur != self.request.user and not self.request.user.is_superuser:
                raise ValidationError("Vous ne pouvez pas assigner une tâche pour ce projet.")
            # Vérifie si l'utilisateur assigné est actif
            if not assignee.is_active:
                raise ValidationError("L'utilisateur assigné doit être actif.")

        # ✅ Crée la tâche après vérification
        serializer.save()

    # ✅ Protection sur la modification
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Vérification que l'utilisateur est bien le propriétaire du projet ou le superuser
        if instance.projet.utilisateur != request.user and not request.user.is_superuser:
            return Response({"detail": "Vous n'avez pas la permission de modifier cette tâche."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    # Protection sur la suppression
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Vérification que l'utilisateur est bien le propriétaire du projet
        if instance.projet.utilisateur != request.user and not request.user.is_superuser:
            return Response({"detail": "Vous n'avez pas la permission de supprimer cette tâche."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)