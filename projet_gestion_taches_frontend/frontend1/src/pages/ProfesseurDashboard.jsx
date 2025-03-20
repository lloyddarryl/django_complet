import React, { useEffect, useState } from "react";
import { Clock, Calendar, ChevronRight,User } from "lucide-react";
import { getProjets, getTaches, deleteProjet } from "../services/api";
import BarreNavigationProf from "../components/BarreNavigationProf";
import { useProf } from "../context/ProfContext";
import { useNavigate } from 'react-router-dom';

// Fonction pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return '';
  }
};

// Fonction pour déterminer la couleur basée sur la proximité de la date limite
const getDateLimitColor = (dateLimite) => {
  if (!dateLimite) return 'bg-gray-100 text-gray-800';

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliser l'heure pour comparer uniquement les dates
  
  const limitDate = new Date(dateLimite);
  limitDate.setHours(0, 0, 0, 0); // Normaliser l'heure
  
  // Calculer la différence en jours
  const daysDifference = Math.floor((limitDate - today) / (1000 * 3600 * 24));

  if (daysDifference < 0) return 'bg-red-100 text-red-800';  // Date dépassée
  if (daysDifference < 7) return 'bg-red-100 text-red-800';  // Moins d'une semaine
  if (daysDifference < 30) return 'bg-orange-100 text-orange-800';  // Moins d'un mois
  return 'bg-green-100 text-green-800';  // Plus d'un mois
};

const ProfesseurDashboard = () => {
  const navigate = useNavigate();
  const { prof } = useProf();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projetsData = await getProjets();
        const tachesData = await getTaches();
        setProjets(projetsData);
        setTaches(tachesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation vers la page de projets
  const handleAddProject = () => {
    navigate('/projets');
  };

  // Navigation vers la page de tâches
  const handleAddTask = (projetId) => {
    if (projetId) {
      navigate('/taches', { state: { preselectedProjetId: projetId } });
    } else {
      navigate('/taches');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProjet(id);
      setProjets(projets.filter((projet) => projet.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barre de navigation avec props corrigées */}
      <BarreNavigationProf
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 overflow-y-auto p-6 ${
          isSidebarOpen ? 'ml-30' : 'ml-30'
        } w-full`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center rounded-lg">
          <h1 className="text-xl font-bold text-gray-800">Tableau de bord</h1>
          <div className="text-sm text-gray-600 flex items-center">
            <Clock size={16} className="mr-2" />
            {new Date().toLocaleDateString("fr-FR", {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </header>

        {/* Section de bienvenue */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 flex items-center">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-2">
              Bienvenue, <strong>{prof.prenom} {prof.nom}</strong> !
            </h2>
            <p className="text-gray-600">
              Vous avez <span className="font-bold text-green-600">
                {taches.length} tâches
              </span> assignées.
            </p>
          </div>
          <button 
            onClick={() => navigate('/profil')}
            className="ml-4 p-2 rounded-full hover:bg-gray-100 transition text-green-600"
            title="Modifier le profil"
          >
            <User size={24} />
          </button>
          <img 
            src="/logo_esmt.jpg" 
            alt="Logo ESMT" 
            className="w-24 h-24 object-contain ml-4"
          />
        </div>
        {/* Sections Projets & Tâches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Projets récents */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Projets récents</h3>
              <button 
                onClick={handleAddProject}
                className="text-green-500 font-medium hover:text-green-700 flex items-center transition-colors"
              >
                <span>Ajouter un projet</span>
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            {projets.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {projets.slice(0, 5).map((projet) => (
                  <li key={projet.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{projet.nom}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          projet.statut === "En cours"
                            ? "bg-yellow-100 text-yellow-800"
                            : projet.statut === "Terminé"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {projet.statut || 'À faire'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <p className="text-gray-500">
                        <Calendar size={14} className="inline mr-1" />
                        <span className={`${getDateLimitColor(projet.date_limite)} px-2 py-0.5 rounded`}>
                          {formatDate(projet.date_limite) || 'Date non définie'}
                        </span>
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(projet.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                        <button 
                          onClick={() => handleAddTask(projet.id)}
                          className="text-xs text-green-500 hover:text-green-700"
                        >
                          + Ajouter une tâche
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun projet disponible.</p>
                <button 
                  onClick={handleAddProject}
                  className="mt-2 text-green-500 hover:text-green-700 font-medium"
                >
                  Créer votre premier projet
                </button>
              </div>
            )}
            {projets.length > 5 && (
              <div className="mt-4 text-center">
                <button 
                  onClick={handleAddProject}
                  className="text-green-500 hover:text-green-700 text-sm font-medium"
                >
                  Voir tous les projets
                </button>
              </div>
            )}
          </div>

          {/* Tâches urgentes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Tâches urgentes</h3>
              <button 
                onClick={() => handleAddTask()}
                className="text-green-500 font-medium hover:text-green-700 flex items-center transition-colors"
              >
                <span>Ajouter une tâche</span>
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            {taches.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {taches
                  .sort((a, b) => {
                    // Sort by date proximity first
                    const dateA = new Date(a.date_limite || '9999-12-31');
                    const dateB = new Date(b.date_limite || '9999-12-31');
                    return dateA - dateB;
                  })
                  .slice(0, 5)
                  .map((tache) => (
                  <li key={tache.id} className="py-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{tache.titre || tache.nom}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          tache.statut === "En cours"
                            ? "bg-yellow-100 text-yellow-800"
                            : tache.statut === "Terminé"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tache.statut || 'À faire'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <p className="text-gray-500">
                        <span>
                        Assigné à: <span className="font-medium">{tache.projet ? projets.find(p => p.id === tache.projet)?.nom : 'Non assigné'}</span>                        </span>
                      </p>
                      <span className={`${getDateLimitColor(tache.date_limite)} px-2 py-0.5 rounded text-xs`}>
                        {formatDate(tache.date_limite) || 'Date non définie'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucune tâche disponible.</p>
                <button 
                  onClick={() => handleAddTask()}
                  className="mt-2 text-green-500 hover:text-green-700 font-medium"
                >
                  Créer votre première tâche
                </button>
              </div>
            )}
            {taches.length > 5 && (
              <div className="mt-4 text-center">
                <button 
                  onClick={() => handleAddTask()}
                  className="text-green-500 hover:text-green-700 text-sm font-medium"
                >
                  Voir toutes les tâches
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfesseurDashboard;