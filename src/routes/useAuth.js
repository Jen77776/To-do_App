// src/hooks/useAuth.js
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/.auth/me');
      const data = await response.json();
      setIsAuthenticated(!!data.clientPrincipal);
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};

export default useAuth;
