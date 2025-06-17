
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface User {
  username: string;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('auth_user', null);
  const [isLoading, setIsLoading] = useState(false);

  // Comptes de démonstration
  const demoAccounts = [
    { username: 'admin', password: 'password' },
    { username: 'expert-comptable', password: 'demo123' },
    { username: 'directeur', password: 'ecole123' }
  ];

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validAccount = demoAccounts.find(
      account => account.username === username && account.password === password
    );
    
    if (validAccount) {
      setUser({
        username: validAccount.username,
        isAuthenticated: true
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user?.isAuthenticated || false;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}
