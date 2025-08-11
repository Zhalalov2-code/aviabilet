import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import axios from 'axios';

const API_URL = 'https://6873df93c75558e27355818e.mockapi.io/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
          try {
            setProfile(JSON.parse(saved));
            setLoading(false);
            return; 
          } catch { }
        }

        try {
          const res = await axios.get(API_URL, { params: { uid: firebaseUser.uid } });
          setProfile(Array.isArray(res.data) ? res.data[0] || null : null);
        } catch (error) {
          console.error('Ошибка при загрузке профиля пользователя:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
