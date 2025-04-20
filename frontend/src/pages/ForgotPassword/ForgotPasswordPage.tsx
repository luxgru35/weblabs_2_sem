import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch} from '../../store/hooks';
import { sendResetEmail } from '../../store/slices/authSlice';
import styles from './ForgotPassword.module.scss';

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await dispatch(sendResetEmail(email)).unwrap();
      setMessage(response);
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Восстановление пароля</h1>
        
        <div className={styles.funnySection}>
          <img 
            src="https://i.gifer.com/7VE.gif" 
            alt="Забавный котик с паролем"
            className={styles.funnyImage}
          />
          <p className={styles.reminder}>Не забывайте пароль в следующий раз! 😉</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              placeholder="Введите ваш email"
            />
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Отправить инструкции
          </button>
          
          {message && <p className={styles.message}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
          
          <Link to="/login" className={styles.backLink}>
            ← Вернуться к странице входа
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
