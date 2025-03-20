import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { getTaches, createTache, updateTache, deleteTache, getProjets } from '../services/api';
import { useEtudiant } from '../context/EtudiantContext';
import { useProf } from '../context/ProfContext';
import { tabStorage } from '../utils/sessionStorage';
import BarreNavigationEtu from '../components/BarreNavigationEtu';
import BarreNavigationProf from '../components/BarreNavigationProf';

// Fonction pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Fonction pour déterminer la couleur basée sur la proximité de la date limite
const getDateLimitColor = (dateLimite) => {
  if (!dateLimite) return 'bg-gray-100 text-gray-800';

  const today = new Date();
  const limitDate = new Date(dateLimite);
  const daysDifference = (limitDate - today) / (1000 * 3600 * 24);

  if (daysDifference < 7) return 'bg-red-100 text-red-800';  // Moins d'une semaine
  if (daysDifference < 30) return 'bg-orange-100 text-orange-800';  // Moins d'un mois
  return 'bg-green-100 text-green-800';  // Plus d'un mois
};

const Taches = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [taches, setTaches] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire
  const [nomTache, setNomTache] = useState('');
  const [projetId, setProjetId] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('taches');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Déterminer quel contexte utiliser en fonction du rôle
  const role = tabStorage.getItem('role');
  const etudiantContext = useEtudiant();
  const profContext = useProf();
  
  // Utiliser le bon contexte selon le rôle
  const userInfo = role === 'PROFESSEUR' ? profContext.prof : etudiantContext.etudiant;

  // Récupérer les tâches et les projets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tachesData = await getTaches();
        const projetsData = await getProjets();
        
        // Logs de débogage détaillés
        console.log('Tâches récupérées COMPLÈTES:', tachesData);
        console.log('Projets récupérés:', projetsData);

        // Log détaillé des tâches
        tachesData.forEach(tache => {
          console.log('Détails COMPLETS de la tâche:', {
            id: tache.id,
            nom: tache.nom,
            projet: tache.projet,
            type_projet: typeof tache.projet,
            date_limite: tache.date_limite
          });
        });

        setTaches(tachesData);
        setProjets(projetsData);

        // Vérifier si un projet est présélectionné
        if (location.state?.preselectedProjetId) {
          setProjetId(location.state.preselectedProjetId);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  // Gérer le changement d'onglet
  const handleTabChange = (tab) => {
    if (tab === 'dashboard') {
      navigate(role === 'PROFESSEUR' ? '/professeur' : '/etudiant');
    } else {
      setActiveTab(tab);
      if (tab === 'projets') {
        navigate('/projets');
      }
    }
  };

  // Ajouter ou modifier une tâche
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Soumettre tâche - Données:', { 
        nomTache, 
        projetId, 
        dateLimite 
      });

      if (editId) {
        await updateTache(editId, {
          nom: nomTache,
          projet: projetId,
          date_limite: dateLimite,
        });
      } else {
        await createTache({
          nom: nomTache,
          projet: projetId,
          date_limite: dateLimite,
        });
      }
      // Rafraîchir la liste après ajout/modification
      const tachesData = await getTaches();
      console.log('Tâches après ajout/modification:', tachesData);
      setTaches(tachesData);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la soumission de la tâche:', error);
      console.log('Données envoyées:', { nomTache, projetId, dateLimite });
    }
  };

  // Préparer la modification
  const handleEdit = (tache) => {
    setEditId(tache.id);
    setNomTache(tache.nom);
    setProjetId(tache.projet);  // Utiliser directement l'ID du projet
    setDateLimite(tache.date_limite);
  };

  // Supprimer une tâche
  const handleDelete = async (id) => {
    try {
      await deleteTache(id);
      setTaches(taches.filter((tache) => tache.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setEditId(null);
    setNomTache('');
    setProjetId('');
    setDateLimite('');
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  // Sélectionner la barre de navigation appropriée
  const NavigationBar = role === 'PROFESSEUR' ? BarreNavigationProf : BarreNavigationEtu;

  // Filtrer les tâches par projet sélectionné
  const tachesFiltrees = projetId 
    ? taches.filter(tache => {
        console.log('Filtrage - Tâche complète:', tache);
        console.log('ID du projet de la tâche:', tache.projet);
        console.log('ID du projet filtré:', projetId);
        
        // Convertir les deux en nombre pour la comparaison
        return Number(tache.projet) === Number(projetId);
      }) 
    : taches;

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
            <h1 className="text-2xl font-bold">Mes tâches - {userInfo.prenom} {userInfo.nom}</h1>
            <p>Connecté en tant que {role}</p>
          </div>

          {/* Formulaire d'ajout/modification */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {editId ? "Modifier une tâche" : "Ajouter une tâche"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nomTache" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la tâche
                  </label>
                  <input
                    id="nomTache"
                    type="text"
                    placeholder="Nom de la tâche"
                    value={nomTache}
                    onChange={(e) => setNomTache(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="projetId" className="block text-sm font-medium text-gray-700 mb-2">
                    Projet
                  </label>
                  <select
                    id="projetId"
                    value={projetId}
                    onChange={(e) => setProjetId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un projet</option>
                    {projets.map((projet) => (
                      <option key={projet.id} value={projet.id}>
                        {projet.nom}
                      </option>
                    ))}
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
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className={`flex-grow ${role === 'PROFESSEUR' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-md transition duration-300`}
                  >
                    {editId ? "Modifier" : "Ajouter"}
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
            </div>

            {/* Liste des tâches */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Liste des tâches</h2>
                {projets.length > 0 && (
                  <select
                    value={projetId}
                    onChange={(e) => setProjetId(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Tous les projets</option>
                    {projets.map((projet) => (
                      <option key={projet.id} value={projet.id}>
                        {projet.nom}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {tachesFiltrees.length === 0 ? (
                <p className="text-gray-500 text-center">Aucune tâche disponible.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {tachesFiltrees.map((tache) => (
                    <li key={tache.id} className="py-4 hover:bg-gray-50 transition duration-300">
                      <div className="flex justify-between items-center">
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-800">{tache.nom}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-600">
                              Projet : 
                              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {projets.find(p => p.id === tache.projet)?.nom || 'Projet non trouvé'}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Limite : 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getDateLimitColor(tache.date_limite)}`}>
                                {formatDate(tache.date_limite)}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(tache)}
                            className="text-green-500 hover:text-green-700 transition duration-300 p-2 rounded-full hover:bg-green-100"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(tache.id)}
                            className="text-red-500 hover:text-red-700 transition duration-300 p-2 rounded-full hover:bg-red-100"
                            title="Supprimer"
                          ><Trash2 size={18} />
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
    </div>
  );
};

export default Taches;