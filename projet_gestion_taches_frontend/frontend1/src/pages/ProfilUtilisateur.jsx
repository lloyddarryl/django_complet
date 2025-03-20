import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Save } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tabStorage } from '../utils/sessionStorage';
import { useEtudiant } from '../context/EtudiantContext';
import { useProf } from '../context/ProfContext';
import BarreNavigationEtu from '../components/BarreNavigationEtu';
import BarreNavigationProf from '../components/BarreNavigationProf';

const ProfilUtilisateur = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const role = tabStorage.getItem('role');

  // Utiliser le contexte approprié selon le rôle
  const { etudiant, updateEtudiant } = useEtudiant();
  const { prof, updateProf } = useProf();
  const userInfo = role === 'PROFESSEUR' ? prof : etudiant;
  const updateUser = role === 'PROFESSEUR' ? updateProf : updateEtudiant;

  // États pour le formulaire
  const [formData, setFormData] = useState({
    first_name: userInfo.prenom || '',
    last_name: userInfo.nom || '',
    date_naissance: '',
    avatar: null,
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // États pour gérer les erreurs et l'affichage
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profil');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Charger la date de naissance existante si disponible
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/utilisateurs/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.date_naissance) {
          setFormData(prev => ({
            ...prev,
            date_naissance: response.data.date_naissance
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails utilisateur', error);
      }
    };

    fetchUserDetails();
  }, []);

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    if (id === 'avatar' && files) {
      setFormData(prev => ({
        ...prev,
        avatar: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }

    // Effacer les erreurs spécifiques au champ
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des mots de passe
    const newErrors = {};
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Les mots de passe ne correspondent pas";
    }

    // Validation du mot de passe actuel si un nouveau mot de passe est fourni
    if (formData.new_password && !formData.current_password) {
      newErrors.current_password = "Vous devez saisir le mot de passe actuel pour le changer";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = new FormData();
    payload.append('first_name', formData.first_name);
    payload.append('last_name', formData.last_name);
    
    if (formData.date_naissance) {
      payload.append('date_naissance', formData.date_naissance);
    }
    
    if (formData.avatar) {
      payload.append('avatar', formData.avatar);
    }
    
    if (formData.current_password) {
      payload.append('current_password', formData.current_password);
    }
    
    if (formData.new_password) {
      payload.append('new_password', formData.new_password);
      payload.append('confirm_password', formData.confirm_password); // Nouvelle ligne
    }

    // Log du payload pour débogage
    console.log('Payload:', Object.fromEntries(payload));

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put(
        'http://127.0.0.1:8000/api/utilisateurs/update_profile/', 
        payload, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Mettre à jour le contexte
      updateUser({
        prenom: response.data.first_name,
        nom: response.data.last_name
      });

      // Mettre à jour tabStorage
      tabStorage.setItem('nom', response.data.last_name);
      tabStorage.setItem('prenom', response.data.first_name);

      alert('Profil mis à jour avec succès');
      
      // Redirection vers le tableau de bord
      navigate(role === 'PROFESSEUR' ? '/professeur' : '/etudiant');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error.response?.data);
      
      // Gérer les erreurs du serveur
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Erreur lors de la mise à jour du profil');
      }
    }
  };

  // Ouvrir le sélecteur de fichiers
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Sélectionner la barre de navigation appropriée
  const NavigationBar = role === 'PROFESSEUR' ? BarreNavigationProf : BarreNavigationEtu;

  return (
    <div className="flex h-screen bg-gray-100">
      <NavigationBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div 
        className={`transition-all duration-300 overflow-y-auto p-6 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } w-full`}
      >
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className={`text-2xl font-bold mb-6 text-center ${
            role === 'PROFESSEUR' ? 'text-green-600' : 'text-indigo-600'
          }`}>
            Modifier mon profil
          </h2>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div 
              className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
              onClick={handleAvatarClick}
            >
              {formData.avatar ? (
                <img 
                  src={URL.createObjectURL(formData.avatar)} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="text-gray-500" size={64} />
              )}
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2">
                <Camera size={16} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                id="avatar"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>
              )}
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>
              )}
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">
                Date de naissance
              </label>
              <input
                type="date"
                id="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                  errors.date_naissance ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date_naissance && (
                <p className="mt-1 text-xs text-red-500">{errors.date_naissance}</p>
              )}
            </div>

            {/* Mot de passe actuel */}
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                Mot de passe actuel (requis pour changer le mot de passe)
              </label>
              <input
                type="password"
                id="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                  errors.current_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Laisser vide si vous ne changez pas de mot de passe"
              />
              {errors.current_password && (
                <p className="mt-1 text-xs text-red-500">{errors.current_password}</p>
              )}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe (optionnel)
              </label>
              <input
                type="password"
                id="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                  errors.new_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Laisser vide si vous ne changez pas de mot de passe"
              />
              {errors.new_password && (
                <p className="mt-1 text-xs text-red-500">{errors.new_password}</p>
              )}
            </div>

            {/* Confirmation du nouveau mot de passe */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                id="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${
                  errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirmer le nouveau mot de passe"
              />
              {errors.confirm_password && (
                <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>
              )}
            </div>

            {/* Bouton de soumission */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  role === 'PROFESSEUR' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Save className="mr-2" size={20} /> Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilUtilisateur;