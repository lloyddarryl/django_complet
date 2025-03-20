import React, { useState, useEffect } from 'react';
import { Layout, List, BookOpen, BarChart2, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tabStorage } from '../utils/sessionStorage';
import { useEtudiant } from '../context/EtudiantContext';

const BarreNavigation = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { etudiant, updateEtudiant } = useEtudiant();

  // Récupération des infos utilisateur depuis tabStorage
  useEffect(() => {
    const nom = tabStorage.getItem('nom');
    const prenom = tabStorage.getItem('prenom');
    const role = tabStorage.getItem('role') || 'ETUDIANT';

    updateEtudiant({ nom, prenom, role });
  }, [updateEtudiant]);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    
    // nettoyer tabStorage
    tabStorage.clear();
    
    navigate('/login');
  };

  return (
    <div
      className={`h-screen bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Bouton pour ouvrir/fermer le menu */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <h1
          className={`text-xl font-bold transition-all duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ESMT Etu
        </h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Informations utilisateur */}
      <div className="p-5 flex items-center border-b border-gray-800">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          {etudiant.prenom && etudiant.prenom[0]}
          {etudiant.nom && etudiant.nom[0]}
        </div>
        {isOpen && (
          <div className="ml-3">
            <p className="font-semibold text-sm">
              {etudiant.prenom} {etudiant.nom}
            </p>
            <p className="text-xs text-gray-400">{etudiant.role}</p>
          </div>
        )}
      </div>

      {/* Liens de navigation */}
      <nav className="flex-1 p-3">
        <ul>
          <li
            className={`mb-2 rounded ${
              activeTab === 'dashboard' ? 'bg-indigo-700' : ''
            }`}
          >
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center p-3 w-full text-left"
            >
              <Layout size={18} className="mr-3" />
              {isOpen && <span>Tableau de bord</span>}
            </button>
          </li>
          <li
            className={`mb-2 rounded ${
              activeTab === 'projets' ? 'bg-indigo-700' : ''
            }`}
          >
            <button
              onClick={() => navigate('/projets')}
              className="flex items-center p-3 w-full text-left"
            >
              <BookOpen size={18} className="mr-3" />
              {isOpen && <span>Mes projets</span>}
            </button>
          </li>
          <li
            className={`mb-2 rounded ${
              activeTab === 'taches' ? 'bg-indigo-700' : ''
            }`}
          >
            <button
              onClick={() => navigate('/taches')}
              className="flex items-center p-3 w-full text-left"
            >
              <List size={18} className="mr-3" />
              {isOpen && <span>Mes tâches</span>}
            </button>
          </li>
          <li
            className={`mb-2 rounded ${
              activeTab === 'statistiques' ? 'bg-indigo-700' : ''
            }`}
          >
            <button
            onClick={() => {
              setActiveTab('statistiques');
                navigate('/statistiques');
                          }}
                    className="flex items-center p-3 w-full text-left"
                >
                <BarChart2 size={18} className="mr-3" />
                  {isOpen && <span>Statistiques</span>}
                </button>
          </li>
        </ul>
      </nav>

      {/* Déconnexion */}
      <div className="p-5 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-red-400 hover:text-red-300"
        >
          <LogOut size={18} className="mr-3" />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default BarreNavigation;