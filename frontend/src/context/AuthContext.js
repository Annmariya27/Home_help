import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const { data } = await authApi.getProfile();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Logged in successfully!');
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const { data } = await authApi.registerUser(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Account created successfully!');
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const registerWorker = async (workerData) => {
    try {
      const { data } = await authApi.registerWorker(workerData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.worker));
      setUser(data.worker);
      toast.success('Worker account created successfully!');
      return data.worker;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    registerUser,
    registerWorker,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isUser: user?.type === 'user',
    isWorker: user?.type === 'worker',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};