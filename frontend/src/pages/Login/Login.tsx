import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { checkAuthToken } from '../../store/slices/authSlice';
import styles from './Login.module.scss';
import LoginForm from './components/LoginForm/LoginForm';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthToken());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/events');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogoClick = () => {
    navigate('/');
  };

  if (isLoading) {
    return <div className={styles.loading}>Проверка авторизации...</div>;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.backgroundAnimation}></div>
      <div className={styles.loginContainer}>
        <div className={styles.logoSection}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png" 
            alt="Логотип" 
            className={styles.logo}
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
          <h1 className={styles.title}>
            Добро пожаловать в{' '}
            <span 
              className={styles.appName}
              onClick={handleLogoClick}
            >
              МоиМероприятия
            </span>
          </h1>
          <p className={styles.subtitle}>Войдите, чтобы управлять своими мероприятиями</p>
        </div>
        <div className={styles.formSection}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;