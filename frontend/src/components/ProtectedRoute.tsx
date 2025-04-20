import { Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { JSX, useEffect, useState } from 'react';
import { checkAuthToken } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [checked, setChecked] = useState(false); // локально отслеживаем, завершена ли проверка токена

  useEffect(() => {
    const verify = async () => {
      await dispatch(checkAuthToken());
      setChecked(true);
    };

    verify();
  }, [dispatch]);

  if (!checked || isLoading) {
    return <div>Loading...</div>; // ждём завершения проверки
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
