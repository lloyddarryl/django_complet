import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// fonction  pour déboguer les requêtes
const logApiRequest = (method, endpoint, data = null) => {
  console.log(`API ${method} ${endpoint}`, data ? { data } : '');
};

// Fonction utilitaire pour déboguer les réponses
const logApiResponse = (method, endpoint, response) => {
  console.log(`API ${method} ${endpoint} Response:`, response.data);
  return response.data;
};

// affichage de la liste des projets
export const getProjets = async () => {
  const token = localStorage.getItem('access_token');
  logApiRequest('GET', '/projets/');
  try {
    const response = await api.get('/projets/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return logApiResponse('GET', '/projets/', response);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw error;
  }
};

// affichage de la liste des tâches
export const getTaches = async () => {
  const token = localStorage.getItem('access_token');
  logApiRequest('GET', '/taches/');
  try {
    const response = await api.get('/taches/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return logApiResponse('GET', '/taches/', response);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    throw error;
  }
};

// créer un projet
export const createProjet = async (data) => {
  const token = localStorage.getItem('access_token');

  //  la date est correctement formatée
  const payload = {
    ...data,

    // la date est au format YYYY-MM-DD
    date_limite: data.date_limite ? data.date_limite : null
  };
  
  logApiRequest('POST', '/projets/', payload);
  try {
    const response = await api.post('/projets/', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return logApiResponse('POST', '/projets/', response);
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    throw error;
  }
};

// modifier un projet
export const updateProjet = async (id, data) => {
  const token = localStorage.getItem('access_token');
  // S'assurer que la date est correctement formatée
  const payload = {
    ...data,
    date_limite: data.date_limite ? data.date_limite : null
  };
  
  logApiRequest('PUT', `/projets/${id}/`, payload);
  try {
    const response = await api.put(`/projets/${id}/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return logApiResponse('PUT', `/projets/${id}/`, response);
  } catch (error) {
    console.error('Erreur lors de la modification du projet:', error);
    throw error;
  }
};

// supprimer un projet
export const deleteProjet = async (id) => {
  const token = localStorage.getItem('access_token');
  logApiRequest('DELETE', `/projets/${id}/`);
  try {
    await api.delete(`/projets/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Projet ID ${id} supprimé avec succès`);
    return id;
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    throw error;
  }
};

/// section des âches dans api.js

// créer une tâche
export const createTache = async (data) => {
  const token = localStorage.getItem('access_token');
  
  // Conversion explicite de l'ID du projet en nombre
  const payload = {
    ...data,
    date_limite: data.date_limite ? data.date_limite : null,
    projet: Number(data.projet)  // Conversion explicite en nombre
  };
  
  console.log('Payload envoyé pour création de tâche:', payload);
  
  try {
    const response = await api.post('/taches/', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Réponse de création de tâche:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error.response);
    throw error;
  }
};

// Modifier une tâche
export const updateTache = async (id, data) => {
  const token = localStorage.getItem('access_token');

  // la date est correctement formatée
  const payload = {
    ...data,
    date_limite: data.date_limite ? data.date_limite : null
  };
  
  logApiRequest('PUT', `/taches/${id}/`, payload);
  try {
    const response = await api.put(`/taches/${id}/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return logApiResponse('PUT', `/taches/${id}/`, response);
  } catch (error) {
    console.error('Erreur lors de la modification de la tâche:', error);
    console.log('Données envoyées:', payload);
    throw error;
  }
};

// Supprimer une tâche
export const deleteTache = async (id) => {
  const token = localStorage.getItem('access_token');
  logApiRequest('DELETE', `/taches/${id}/`);
  try {
    await api.delete(`/taches/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Tâche ID ${id} supprimée avec succès`);
    return id;
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    throw error;
  }
};

export default api;