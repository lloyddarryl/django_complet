import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, ChevronRight } from 'lucide-react';

const Accueil = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="/logo_esmt.jpg" 
            alt="Logo ESMT" 
            className="w-20 h-20 object-contain"
          />
          <span className="text-xl font-bold text-gray-800">Plateforme de Gestion de Tâches Collaboratives</span>
        </div>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
          >
            Connexion
          </Link>
          <Link 
            to="/inscription" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Partie gauche - Texte */}
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Gérez vos projets <br />et vos tâches efficacement
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Une plateforme innovante conçue pour les étudiants et les professeurs de l'ESMT, 
            permettant une gestion collaborative et transparente des projets et des tâches.
          </p>
          
          {/* Caractéristiques */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-4">
              <BookOpen className="text-blue-600" size={32} />
              <span className="text-gray-700">Suivi détaillé des projets</span>
            </div>
            <div className="flex items-center space-x-4">
              <Users className="text-blue-600" size={32} />
              <span className="text-gray-700">Collaboration en temps réel</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle className="text-blue-600" size={32} />
              <span className="text-gray-700">Gestion des tâches simplifiée</span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Connexion
              <ChevronRight className="ml-2" size={20} />
            </Link>
            <Link 
              to="/inscription" 
              className="flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              S'inscrire
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>

        {/* Partie droite - Illustration */}
        <div className="hidden md:flex justify-center">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
            <img 
              src="undraw_project-completed_fwjq.svg" 
              alt="Collaboration Illustration" 
              className="relative z-10 w-full max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} ESMT - École Supérieure Multinationale des Télécommunications
      </footer>
    </div>
  );
};

export default Accueil;