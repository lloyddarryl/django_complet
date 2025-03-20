import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inscription = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // États pour les informations personnelles
  const [personalInfo, setPersonalInfo] = useState({
    nom: '',
    prenom: '',
    username: '',
    email: '',
    dateNaissance: ''
  });

  // États pour les informations de compte
  const [accountInfo, setAccountInfo] = useState({
    role: '',
    password: '',
    confirmPassword: ''
  });

  // Mise à jour des informations personnelles
  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.id]: e.target.value
    });
    // Effacer l'erreur spécifique lors de la modification
    if (errors[e.target.id]) {
      setErrors(prev => ({...prev, [e.target.id]: ''}));
    }
  };

  // Mise à jour des informations de compte
  const handleAccountInfoChange = (e) => {
    setAccountInfo({
      ...accountInfo,
      [e.target.id]: e.target.value
    });
    // Effacer l'erreur spécifique lors de la modification
    if (errors[e.target.id]) {
      setErrors(prev => ({...prev, [e.target.id]: ''}));
    }
  };

  // étape 1
  const validatePersonalInfo = () => {
    const newErrors = {};
    const { nom, prenom, username, email, dateNaissance } = personalInfo;
    
    if (!nom) newErrors.nom = 'Le nom est requis';
    if (!prenom) newErrors.prenom = 'Le prénom est requis';
    if (!username) newErrors.username = 'Le nom d\'utilisateur est requis';
    if (!email) newErrors.email = 'L\'email est requis';
    if (!dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // étape 2
  const validateAccountInfo = () => {
    const newErrors = {};
    const { role, password, confirmPassword } = accountInfo;
    
    if (!role) newErrors.role = 'Le rôle est requis';
    if (!password) newErrors.password = 'Le mot de passe est requis';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire d'inscription
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePersonalInfo() || !validateAccountInfo()) {
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/inscription/', {
        username: personalInfo.username,
        first_name: personalInfo.prenom,
        last_name: personalInfo.nom,
        email: personalInfo.email,
        date_naissance: personalInfo.dateNaissance,
        password: accountInfo.password,
        confirmation_mot_de_passe: accountInfo.confirmPassword,
        role: accountInfo.role
      });

      // Redirection vers la page de connexion après inscription
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.response?.data);
      
      // Gérer les erreurs spécifiques du serveur
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
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
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Plateforme de gestion des tâches ESMT
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {/* Indicateur d'étape */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                1
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div className={`h-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: step === 1 ? '0%' : '100%' }}></div>
              </div>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Informations personnelles</span>
              <span>Compte et sécurité</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              /* Étape 1: Informations personnelles */
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      value={personalInfo.nom}
                      onChange={handlePersonalInfoChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                        ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                  </div>
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      value={personalInfo.prenom}
                      onChange={handlePersonalInfoChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                        ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nom d'utilisateur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={personalInfo.username}
                    onChange={handlePersonalInfoChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateNaissance"
                    value={personalInfo.dateNaissance}
                    onChange={handlePersonalInfoChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      ${errors.dateNaissance ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.dateNaissance && <p className="text-red-500 text-xs mt-1">{errors.dateNaissance}</p>}
                </div>
              </>
            ) : (
              /* Étape 2: Mot de passe et rôle */
              <>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    value={accountInfo.role}
                    onChange={handleAccountInfoChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="ETUDIANT">Étudiant</option>
                    <option value="PROFESSEUR">Professeur</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={accountInfo.password}
                      onChange={handleAccountInfoChange}
                      className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                        ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={accountInfo.confirmPassword}
                      onChange={handleAccountInfoChange}
                      className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                        ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {/* Boutons de navigation / soumission */}
            <div className="flex justify-between">
              {step === 1 ? (
                <div className="flex justify-end w-full">
                  <button
                    type="button"
                    onClick={() => {
                      if (validatePersonalInfo()) {
                        setStep(2);
                      }
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Suivant
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Vous avez déjà un compte ?
                </span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <Link 
                to="/login" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Se connecter
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

export default Inscription;