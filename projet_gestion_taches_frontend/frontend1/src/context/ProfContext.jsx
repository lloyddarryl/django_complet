import React, { createContext, useState, useContext, useCallback } from "react";
import { tabStorage } from "../utils/sessionStorage";

export const ProfContext = createContext({
  prof: {
    nom: '',
    prenom: '',
    role: 'PROFESSEUR'
  },
  updateProf: () => {}
});

export const useProf = () => {
  const context = useContext(ProfContext);
  if (context === undefined) {
    throw new Error('useProf doit être utilisé à l\'intérieur d\'un ProfProvider');
  }
  return context;
};

export const ProfProvider = ({ children }) => {
  const [prof, setProf] = useState({
    nom: tabStorage.getItem("nom") || "",
    prenom: tabStorage.getItem("prenom") || "",
    role: tabStorage.getItem("role") || "PROFESSEUR",
  });

  const updateProf = useCallback((newData) => {
    setProf((prev) => {
      const updatedData = { ...prev, ...newData };
      
      // mise à jour du tabStorage
      if (newData.nom) tabStorage.setItem("nom", newData.nom);
      if (newData.prenom) tabStorage.setItem("prenom", newData.prenom);
      if (newData.role) tabStorage.setItem("role", newData.role);

      return updatedData;
    });
  }, []);

  return (
    <ProfContext.Provider value={{ prof, updateProf }}>
      {children}
    </ProfContext.Provider>
  );
};