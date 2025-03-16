from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from utilisateurs.views import UtilisateurViewSet, CustomTokenObtainPairView, InscriptionView
from projets.views import ProjetViewSet
from taches.views import TacheViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# on met en place du routeur
router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'projets', ProjetViewSet, basename='projet')
router.register(r'taches', TacheViewSet, basename='tache')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #  Route d'inscription
    path('api/inscription/', InscriptionView.as_view(), name='inscription'),

    # Route pour obtenir les détails de l'utilisateur connecté
    path('api/utilisateurs/me/', UtilisateurViewSet.as_view({'get': 'me'}), name='user-me'),
    # Route pour mettre à jour le profil
    path('api/utilisateurs/update_profile/', UtilisateurViewSet.as_view({'put': 'update_profile'}),
         name='update-profile'),
]

# ajoutde la configuration pour servir les fichiers médias
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)