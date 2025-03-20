import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjets, createProjet, updateProjet, deleteProjet } from '../services/api';
import { useEtudiant } from '../context/EtudiantContext';
import { useProf } from '../context/ProfContext';
import { tabStorage } from '../utils/sessionStorage';
import BarreNavigationEtu from '../components/BarreNavigationEtu';
import BarreNavigationProf from '../components/BarreNavigationProf';
import { Eye, Edit, Trash2, PlusCircle } from 'lucide-react';

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

const Projets = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nomProjet, setNomProjet] = useState("");
  const [statut, setStatut] = useState("En cours");
  const [dateLimite, setDateLimite] = useState("");
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('projets');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const navigate = useNavigate();
  
  // Déterminer quel contexte utiliser en fonction du rôle
  const role = tabStorage.getItem('role');
  const etudiantContext = useEtudiant();
  const profContext = useProf();
  
  // Utiliser le bon contexte selon le rôle
  const userInfo = role === 'PROFESSEUR' ? profContext.prof : etudiantContext.etudiant;

  // Récupérer les projets de l'utilisateur concerné dans le backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projetsData = await getProjets();
        console.log("Projets récupérés:", projetsData);
        setProjets(projetsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour ajouter ou modifier un projet
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // S'assurer que la date est au bon format
      const formattedDate = dateLimite ? dateLimite : null;
      
      if (editId) {
        // Si l'ID existe => Modification
        await updateProjet(editId, { 
          nom: nomProjet, 
          statut, 
          date_limite: formattedDate 
        });
      } else {
        // Sinon => Ajout
        await createProjet({ 
          nom: nomProjet, 
          statut, 
          date_limite: formattedDate 
        });
      }
      // Rafraîchir la liste après ajout/modif
      const projetsData = await getProjets();
      setProjets(projetsData);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la soumission du projet:', error);
      console.log('Données envoyées:', { nomProjet, statut, dateLimite });
    }
  };

  // Fonction pour remplir le formulaire en mode édition
  const handleEdit = (projet) => {
    setEditId(projet.id);
    setNomProjet(projet.nom);
    setStatut(projet.statut || 'En cours');
    setDateLimite(projet.date_limite || '');
  };

  // Fonction pour supprimer un projet
  const handleDelete = async (id) => {
    try {
      await deleteProjet(id);
      // Rafraîchir la liste après suppression
      setProjets(projets.filter((projet) => projet.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setEditId(null);
    setNomProjet("");
    setStatut("En cours");
    setDateLimite("");
  };

  // Gérer la navigation vers le tableau de bord
  const handleDashboardNavigation = () => {
    navigate(role === 'PROFESSEUR' ? '/professeur' : '/etudiant');
  };

  // Naviguer vers la création de tâche pour ce projet
  const handleAddTask = (projetId) => {
    navigate('/taches', { 
      state: { 
        preselectedProjetId: projetId 
      } 
    });
  };

  // Voir les détails du projet (peut-être afficher les tâches associées)
  const handleViewProject = (projet) => {
    // Logique future pour voir les détails du projet
    console.log('Voir les détails du projet', projet);
  };

  // Gérer le changement d'onglet
  const handleTabChange = (tab) => {
    if (tab === 'dashboard') {
      handleDashboardNavigation();
    } else {
      setActiveTab(tab);
      if (tab === 'taches') {
        navigate('/taches');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  // Sélectionner la barre de navigation appropriée
  const NavigationBar = role === 'PROFESSEUR' ? BarreNavigationProf : BarreNavigationEtu;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barre de navigation */}
      <NavigationBar 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Contenu principal */}
      <div 
        className={`transition-all duration-300 overflow-y-auto p-6 ${
          isSidebarOpen ? (role === 'PROFESSEUR' ? 'ml-64' : 'ml-30') : 'ml-20'
        } w-full`}
      >
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className={`${role === 'PROFESSEUR' ? 'bg-green-600' : 'bg-indigo-600'} text-white p-4 mb-6 rounded-lg shadow-md`}>
            <h1 className="text-2xl font-bold">Mes projets - {userInfo.prenom} {userInfo.nom}</h1>
            <p>Connecté en tant que {role}</p>
          </div>

          {/* Formulaire d'ajout / modification */}
          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="nomProjet" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du projet
                </label>
                <input
                  id="nomProjet"
                  type="text"
                  placeholder="Nom du projet"
                  value={nomProjet}
                  onChange={(e) => setNomProjet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  id="statut"
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="À faire">À faire</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dateLimite" className="block text-sm font-medium text-gray-700 mb-2">
                  Date limite
                </label>
                <input
                  id="dateLimite"
                  type="date"
                  value={dateLimite}
                  onChange={(e) => setDateLimite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button
                type="submit"
                className={`${role === 'PROFESSEUR' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-md transition duration-300`}
              >
                {editId ? "Modifier le projet" : "Ajouter un projet"}
              </button>
              
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>

          {/* Liste des projets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Liste des projets</h2>
            {projets.length === 0 ? (
              <p className="text-gray-500 text-center">Aucun projet disponible.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {projets.map((projet) => (
                  <li key={projet.id} className="py-4 hover:bg-gray-50 transition duration-300">
                    <div className="flex justify-between items-center">
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800">{projet.nom}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-600">
                            Statut : 
                            <span 
                              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                projet.statut === 'En cours' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : projet.statut === 'Terminé' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {projet.statut || 'À faire'}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Limite : 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getDateLimitColor(projet.date_limite)}`}>
                              {formatDate(projet.date_limite) || 'Non définie'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProject(projet)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300 p-2 rounded-full hover:bg-blue-100"
                          title="Voir les détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(projet)}
                          className="text-green-500 hover:text-green-700 transition duration-300 p-2 rounded-full hover:bg-green-100"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(projet.id)}
                          className="text-red-500 hover:text-red-700 transition duration-300 p-2 rounded-full hover:bg-red-100"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleAddTask(projet.id)}
                          className="text-purple-500 hover:text-purple-700 transition duration-300 p-2 rounded-full hover:bg-purple-100"
                          title="Ajouter une tâche"
                        >
                          <PlusCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projets;