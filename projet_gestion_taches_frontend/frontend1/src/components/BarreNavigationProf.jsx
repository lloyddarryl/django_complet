import React, { useEffect } from 'react';
import { Layout, List, BookOpen, BarChart2, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tabStorage } from '../utils/sessionStorage';
import { useProf } from '../context/ProfContext';

const BarreNavigationProf = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { prof, updateProf } = useProf();

  // Récupérer infos de l'utilisateur depuis tabStorage
  useEffect(() => {
    const nom = tabStorage.getItem('nom');
    const prenom = tabStorage.getItem('prenom');
    const role = tabStorage.getItem('role') ;

    updateProf({ nom, prenom, role });
  }, [updateProf]);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    
    // Nettoyer aussi tabStorage
    tabStorage.clear();
    
    navigate('/login');
  };

  return (
    <div
      className={`h-screen bg-green-900 text-white transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Bouton pour ouvrir/fermer le menu */}
      <div className="p-4 flex justify-between items-center border-b border-green-800">
        <h1
          className={`text-xl font-bold transition-all duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ESMT Prof
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Informations utilisateur */}
      <div className="p-5 flex items-center border-b border-green-800">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          {prof.prenom && prof.prenom[0]}
          {prof.nom && prof.nom[0]}
        </div>
        {isSidebarOpen && (
          <div className="ml-3">
            <p className="font-semibold text-sm">
              {prof.prenom} {prof.nom}
            </p>
            <p className="text-xs text-gray-400">{prof.role}</p>
          </div>
        )}
      </div>

      {/* Liens de navigation */}
      <nav className="flex-1 p-3">
        <ul>
          {/* Tableau de bord */}
          <li
            className={`mb-2 rounded ${
              activeTab === 'dashboard' ? 'bg-green-700' : ''
            }`}
          >
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center p-3 w-full text-left"
            >
              <Layout size={18} className="mr-3" />
              {isSidebarOpen && <span>Tableau de bord</span>}
            </button>
          </li>

          {/* Mes projets */}
          <li
            className={`mb-2 rounded ${
              activeTab === 'projets' ? 'bg-green-700' : ''
            }`}
          >
            <button
              onClick={() => navigate('/projets')}
              className="flex items-center p-3 w-full text-left"
            >
              <BookOpen size={18} className="mr-3" />
              {isSidebarOpen && <span>Mes projets</span>}
            </button>
          </li>

          {/* Mes tâches */}
          <li
            className={`mb-2 rounded ${
              activeTab === 'taches' ? 'bg-green-700' : ''
            }`}
          >
            <button
              onClick={() => navigate('/taches')}
              className="flex items-center p-3 w-full text-left"
            >
              <List size={18} className="mr-3" />
              {isSidebarOpen && <span>Mes tâches</span>}
            </button>
          </li>

          {/* Statistiques */}
          <li
            className={`mb-2 rounded ${
              activeTab === 'statistiques' ? 'bg-green-700' : ''
            }`}
          >
            <button
              onClick={() => setActiveTab('statistiques')}
              className="flex items-center p-3 w-full text-left"
            >
              <BarChart2 size={18} className="mr-3" />
              {isSidebarOpen && <span>Statistiques</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Déconnexion */}
      <div className="p-5 border-t border-green-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-red-400 hover:text-red-300"
        >
          <LogOut size={18} className="mr-3" />
          {isSidebarOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default BarreNavigationProf;