// src/routes/RequireAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth'; // Adjust the path as necessary

const RequireAuth = ({ component: Component }) => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to home if not authenticated
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Component /> : null;
};
export default RequireAuth;