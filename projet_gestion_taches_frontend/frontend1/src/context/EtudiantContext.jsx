import React, { createContext, useState, useContext, useCallback } from "react";
import { tabStorage } from "../utils/sessionStorage";

export const EtudiantContext = createContext({
  etudiant: {
    nom: '',
    prenom: '',
    role: 'ETUDIANT'
  },
  updateEtudiant: () => {}
});

export const useEtudiant = () => {
  const context = useContext(EtudiantContext);
  if (context === undefined) {
    throw new Error('useEtudiant doit être utilisé à l\'intérieur d\'un EtudiantProvider');
  }
  return context;
};

export const EtudiantProvider = ({ children }) => {
  const [etudiant, setEtudiant] = useState({
    nom: tabStorage.getItem("nom") || "",
    prenom: tabStorage.getItem("prenom") || "",
    role: tabStorage.getItem("role") || "ETUDIANT",
  });

  const updateEtudiant = useCallback((newData) => {
    setEtudiant((prev) => {
      const updatedData = { ...prev, ...newData };
      
      // mise à jour du tabStorage
      if (newData.nom) tabStorage.setItem("nom", newData.nom);
      if (newData.prenom) tabStorage.setItem("prenom", newData.prenom);
      if (newData.role) tabStorage.setItem("role", newData.role);

      return updatedData;
    });
  }, []);

  return (
    <EtudiantContext.Provider value={{ etudiant, updateEtudiant }}>
      {children}
    </EtudiantContext.Provider>
  );
};