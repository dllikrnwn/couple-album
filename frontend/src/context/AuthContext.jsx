import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const guestMode = localStorage.getItem('guestMode');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (guestMode === 'true') {
      setUser({ username: 'Pelihat', isGuest: true });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('guestMode');
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const loginAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    const guestUser = { username: 'Pelihat', isGuest: true };
    localStorage.setItem('user', JSON.stringify(guestUser));
    setUser(guestUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guestMode');
    setUser(null);
  };

  const value = {
    user,
    login,
    loginAsGuest,
    logout,
    loading,
    isAuthenticated: !!user,
    isGuest: user?.isGuest || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
