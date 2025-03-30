import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireAuth;