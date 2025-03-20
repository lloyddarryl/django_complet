import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { tabStorage } from '../utils/sessionStorage';

//  les contextes 
import { EtudiantContext } from '../context/EtudiantContext';
import { ProfContext } from '../context/ProfContext';

const Connexion = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const etudiantContext = useContext(EtudiantContext);
  const profContext = useContext(ProfContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      // Stocker les tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Stocker les infos utilisateur dans localStorage et tabStorage
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', username);
      localStorage.setItem('nom', response.data.nom);
      localStorage.setItem('prenom', response.data.prenom);

      tabStorage.setItem('role', response.data.role);
      tabStorage.setItem('username', username);
      tabStorage.setItem('nom', response.data.nom);
      tabStorage.setItem('prenom', response.data.prenom);

      // mettre à jour le contexte approprié
      if (response.data.role === 'ETUDIANT') {
        if (etudiantContext && etudiantContext.updateEtudiant) {
          etudiantContext.updateEtudiant({
            nom: response.data.nom,
            prenom: response.data.prenom,
            role: 'ETUDIANT'
          });
        }
        navigate('/etudiant');
      } else if (response.data.role === 'PROFESSEUR') {
        if (profContext && profContext.updateProf) {
          profContext.updateProf({
            nom: response.data.nom,
            prenom: response.data.prenom,
            role: 'PROFESSEUR'
          });
        }
        navigate('/professeur');
      } else {
        setError('Rôle non reconnu');
      }
    } catch (err) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center shadow-md">
          <img 
            src="/logo_esmt.jpg" 
            alt="Logo ESMT" 
            className="w-28 h-28 object-contain"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Plateforme de gestion des tâches ESMT
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-4 text-center text-red-600 bg-red-100 py-2 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Se connecter
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Pas encore de compte ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/inscription"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ESMT - École Supérieure Multinationale des Télécommunications
      </footer>
    </div>
  );
};

export default Connexion;