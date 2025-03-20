import React, { useState, useEffect } from 'react';
import { BarChart2, CheckCircle, Clock, PieChart } from 'lucide-react';
import BarreNavigationProf from '../components/BarreNavigationProf';
import { getProjets, getTaches } from '../services/api';
import { useProf } from '../context/ProfContext';
import { tabStorage } from '../utils/sessionStorage';

const StatistiquesProfesseur = () => {
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('statistiques');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { prof, updateProf } = useProf();

  // Utiliser tabStorage pour récupérer et mettre à jour les infos du professeur
  useEffect(() => {
    const nom = tabStorage.getItem('nom');
    const prenom = tabStorage.getItem('prenom');
    const role = tabStorage.getItem('role') || 'PROFESSEUR';

    updateProf({ nom, prenom, role });
  }, [updateProf]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projetsData = await getProjets();
        const tachesData = await getTaches();
        
        setProjets(projetsData);
        setTaches(tachesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonctions de calcul et d'encouragement
  const getEncouragementMessage = (pourcentage) => {
    if (pourcentage === 0) {
      return {
        message: "C'est le moment de commencer ! Chaque grand projet commence par un premier pas.",
        style: "text-red-500"
      };
    } else if (pourcentage > 0 && pourcentage < 50) {
      return {
        message: "Vous avez déjà commencé, continuez comme ça ! La motivation est votre meilleure alliée.",
        style: "text-orange-500"
      };
    } else if (pourcentage >= 50 && pourcentage < 90) {
      return {
        message: "Vous êtes sur la bonne voie ! Plus que quelques efforts et c'est terminé.",
        style: "text-green-500"
      };
    } else if (pourcentage >= 90 && pourcentage < 100) {
      return {
        message: "Bravo ! Vous êtes presque au bout. La ligne d'arrivée est proche !",
        style: "text-green-600 font-bold"
      };
    } else if (pourcentage === 100) {
      return {
        message: "Félicitations ! Objectif accompli avec succès 🎉",
        style: "text-green-700 font-bold"
      };
    }
  };

  // Calcul des statistiques
  const calculerStatistiques = () => {
    const statutTaches = {
      'À faire': 0,
      'En cours': 0,
      'Terminé': 0
    };

    const statutProjets = {
      'À faire': 0,
      'En cours': 0,
      'Terminé': 0
    };

    taches.forEach(tache => {
      statutTaches[tache.statut] = (statutTaches[tache.statut] || 0) + 1;
    });

    projets.forEach(projet => {
      statutProjets[projet.statut] = (statutProjets[projet.statut] || 0) + 1;
    });

    return { statutTaches, statutProjets };
  };

  // Calcul du pourcentage de complétion
  const calculerPourcentageCompletionTaches = () => {
    if (taches.length === 0) return 0;
    const tachesTerminees = taches.filter(tache => tache.statut === 'Terminé').length;
    return Math.round((tachesTerminees / taches.length) * 100);
  };

  // Vérification de l'éligibilité à la prime
  const estEligiblePrime = (pourcentage) => {
    if (pourcentage >= 90 && pourcentage < 100) {
      return {
        montant: 30000,
        message: "Vous êtes éligible à une prime de 30 000 FCFA pour avoir terminé plus de 90% de vos tâches !"
      };
    } else if (pourcentage === 100) {
      return {
        montant: 100000,
        message: "Félicitations ! Vous avez droit à une prime de 100 000 FCFA pour avoir terminé 100% de vos tâches !"
      };
    }
    return null;
  };

  const stats = calculerStatistiques();
  const pourcentageCompletion = calculerPourcentageCompletionTaches();
  const encouragement = getEncouragementMessage(pourcentageCompletion);
  const prime = estEligiblePrime(pourcentageCompletion);

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <BarreNavigationProf 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div 
        className={`transition-all duration-300 overflow-y-auto p-6 ${
          isSidebarOpen ? 'ml-30' : 'ml-20'
        } w-full`}
      >
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="bg-green-600 text-white p-4 mb-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Tableau de statistiques - {prof.prenom} {prof.nom}</h1>
            <p>Vue d'ensemble de vos projets et tâches</p>
          </div>

          {/* Statistiques principales */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Carte de statistiques des projets */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                <BarChart2 className="text-green-600 mr-2" size={20} />
                <h2 className="text-md font-semibold text-gray-800">Projets</h2>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">À faire</span>
                  <span className="font-bold text-green-600">{stats.statutProjets['À faire']}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">En cours</span>
                  <span className="font-bold text-green-600">{stats.statutProjets['En cours']}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Terminés</span>
                  <span className="font-bold text-green-600">{stats.statutProjets['Terminé']}</span>
                </div>
              </div>
            </div>

            {/* Carte de statistiques des tâches */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="text-green-600 mr-2" size={20} />
                <h2 className="text-md font-semibold text-gray-800">Tâches</h2>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">À faire</span>
                  <span className="font-bold text-green-600">{stats.statutTaches['À faire']}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">En cours</span>
                  <span className="font-bold text-green-600">{stats.statutTaches['En cours']}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Terminées</span>
                  <span className="font-bold text-green-600">{stats.statutTaches['Terminé']}</span>
                </div>
              </div>
            </div>

            {/* Carte de progression globale */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                <Clock className="text-green-600 mr-2" size={20} />
                <h2 className="text-md font-semibold text-gray-800">Progression</h2>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Projets</span>
                  <span className="font-bold text-green-600">{projets.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Tâches</span>
                  <span className="font-bold text-green-600">{taches.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Tâches terminées</span>
                  <span className="font-bold text-green-600">
                    {stats.statutTaches['Terminé']} 
                    {' '}({pourcentageCompletion}%)
                  </span>
                </div>
                {encouragement && (
                  <div className={`mt-2 text-xs text-center ${encouragement.style}`}>
                    {encouragement.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Prime avec un style plus compact */}
          {prime && (
            <div className="mt-4 bg-yellow-50 p-3 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-yellow-700 text-sm font-medium flex-grow pr-4">
                  {prime.message}
                </p>
                <span className="text-yellow-900 font-bold text-base bg-yellow-100 px-3 py-1 rounded">
                  {prime.montant.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          )}

          {/* Sections supplémentaires pour le professeur */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {/* Liste des projets récents */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                <PieChart className="text-green-600 mr-2" size={20} />
                <h2 className="text-md font-semibold text-gray-800">Projets Récents</h2>
              </div>
              {projets.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {projets.slice(0, 5).map(projet => (
                    <li key={projet.id} className="py-2 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{projet.nom}</p>
                        <p className="text-xs text-gray-500">
                          Date limite : {new Date(projet.date_limite).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          projet.statut === 'En cours' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : projet.statut === 'Terminé' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {projet.statut}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 text-sm">Aucun projet disponible</p>
              )}
            </div>

            {/* Liste des tâches urgentes */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                <Clock className="text-green-600 mr-2" size={20} />
                <h2 className="text-md font-semibold text-gray-800">Tâches Urgentes</h2>
              </div>
              {taches.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {taches
                    .sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite))
                    .slice(0, 5)
                    .map(tache => (
                      <li key={tache.id} className="py-2 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium text-gray-800">{tache.nom}</p>
                          <p className="text-xs text-gray-500">
                            Projet: {tache.projet?.nom || 'Non assigné'}
                          </p>
                        </div>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            tache.statut === 'En cours' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : tache.statut === 'Terminé' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tache.statut}
                        </span>
                      </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 text-sm">Aucune tâche disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesProfesseur;