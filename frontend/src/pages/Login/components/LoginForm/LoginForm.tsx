import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { loginUser,checkAuthToken } from '../../../../store/slices/authSlice';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        return dispatch(checkAuthToken());
      })
      .then(() => {
        navigate('/events');
      })
      .catch(() => {
        // Обработка ошибок
      });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Пароль</label>
        <input
          id="password"
          type="password"
          placeholder="Введите ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {isError && <div className={styles.error}>{errorMessage}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>

      <div className={styles.footerLinks}>
        <Link to="/forgot-password" className={styles.link}>Забыли пароль?</Link>
        <span className={styles.divider}>|</span>
        <Link to="/register" className={styles.link}>Создать аккаунт</Link>
      </div>
    </form>
  );
};

export default LoginForm;
