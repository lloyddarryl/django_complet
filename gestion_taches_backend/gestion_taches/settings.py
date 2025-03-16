from pathlib import Path
from datetime import timedelta


# chemin de base du projet
BASE_DIR = Path(__file__).resolve().parent.parent

# clé secrète
SECRET_KEY = 'django-insecure-5*^w!j_d4o5q28+tq-9uo$%n276sf&2t$&1-_9!!jdq69&uhh$'

DEBUG = True

#  pour les connexions locales
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Apps installées
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # les modules utiles
    'rest_framework',
    'corsheaders',

    # mes applications
    'utilisateurs',
    'projets',
    'taches',

    # ici c fait pour l'authentification JWT
    'rest_framework_simplejwt',
]

# Middleware (Sécurité et communication)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Autoriser les requêtes externes
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Fichiers de templates HTML
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# URL principale
ROOT_URLCONF = 'gestion_taches.urls'
WSGI_APPLICATION = 'gestion_taches.wsgi.application'

# Base de données (Simple et efficace)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Sécurité des mots de passe
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]

# Langue et fuseau horaire
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Gestion des fichiers statiques
STATIC_URL = 'static/'

# Clé primaire auto-générée
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Connexion avec React
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Authentification avec JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# Configuration des tokens JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

AUTH_USER_MODEL = 'utilisateurs.Utilisateur'

# Configuration pour les fichiers média
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

