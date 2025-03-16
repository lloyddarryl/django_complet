from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Projet
from .serializers import ProjetSerializer


class ProjetViewSet(viewsets.ModelViewSet):
    serializer_class = ProjetSerializer
    permission_classes = [IsAuthenticated]
    queryset = Projet.objects.none()

    # filtre les projets en fonction de l'utilisateur connecté
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Projet.objects.all()
        # j'utilise le `related_name` pour filtrer
        return user.projets.all()

    #  lier  le projet à l'utilisateur connecté
    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)
