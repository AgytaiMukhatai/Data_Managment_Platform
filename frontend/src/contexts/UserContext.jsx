// src/contexts/UserContext.jsx
import { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: 'musterman',
    username: 'Max Musterman',
    email: 'Muster@gmail.com',
    address: 'Location',
    profilePic: null,
    likedDatasets: [], // Nouveau champ pour les datasets likés
  });

  const addLikedDataset = (dataset) => {
    setUser(prev => {
      const alreadyLiked = prev.likedDatasets.some(ds => ds.datasetId === dataset.datasetId);
      if (alreadyLiked) return prev;

      return {
        ...prev,
        likedDatasets: [...prev.likedDatasets, dataset]
      };
    });
  };

  const removeLikedDataset = (datasetId) => {
    setUser(prev => ({
      ...prev,
      likedDatasets: prev.likedDatasets.filter(ds => ds.datasetId !== datasetId)
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, addLikedDataset, removeLikedDataset }}>
      {children}
    </UserContext.Provider>
  );
}
