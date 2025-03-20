/**
 * Utilitaire pour gérer le stockage de session isolé par onglet
 */
const generateTabId = () => {

    if (!sessionStorage.getItem('tabId')) {
      sessionStorage.setItem('tabId', Date.now().toString());
    }
    return sessionStorage.getItem('tabId');
  };
  
  const tabId = generateTabId();
  
  const getKey = (key) => `${tabId}_${key}`;
  
  // api récupérer les données par onglet
  export const tabStorage = {
    setItem: (key, value) => {
      sessionStorage.setItem(getKey(key), value);
    },
    getItem: (key) => {
      return sessionStorage.getItem(getKey(key));
    },
    removeItem: (key) => {
      sessionStorage.removeItem(getKey(key));
    },
    clear: () => {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(tabId)) {
          sessionStorage.removeItem(key);
        }
      });
    }
  };