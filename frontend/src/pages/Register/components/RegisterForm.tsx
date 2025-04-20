import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '@api/authService';
import { setToken } from '@utils/storage';
import styles from './RegisterForm.module.scss';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { token } = await register({
        email,
        name,
        password,
        firstName,
        lastName,
        middleName,
        gender,
        birthDate,
      });
      setToken(token);
      navigate('/login');
    } catch (error) {
      setError('Ошибка регистрации. Пожалуйста, попробуйте снова.');
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
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
        <label htmlFor="name" className={styles.label}>Имя пользователя</label>
        <input
          id="name"
          type="text"
          placeholder="Введите имя пользователя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
  <label htmlFor="firstName" className={styles.label}>Имя</label>
  <input
    id="firstName"
    type="text"
    placeholder="Введите имя"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    className={styles.input}
    required
  />
</div>    

<div className={styles.formGroup}>
  <label htmlFor="lastName" className={styles.label}>Фамилия</label>
  <input
    id="lastName"
    type="text"
    placeholder="Введите фамилию"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    className={styles.input}
    required
  />
</div>

<div className={styles.formGroup}>
  <label htmlFor="middleName" className={styles.label}>Отчество (необязательно)</label>
  <input
    id="middleName"
    type="text"
    placeholder="Введите отчество"
    value={middleName}
    onChange={(e) => setMiddleName(e.target.value)}
    className={styles.input}
  />
</div>

<div className={styles.formGroup}>
  <label htmlFor="gender" className={styles.label}>Пол</label>
  <select
    id="gender"
    value={gender}
    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
    className={styles.input}
    required
  >
    <option value="male">Мужской</option>
    <option value="female">Женский</option>
  </select>
</div>

<div className={styles.formGroup}>
  <label htmlFor="birthDate" className={styles.label}>Дата рождения</label>
  <input
    id="birthDate"
    type="date"
    value={birthDate}
    onChange={(e) => setBirthDate(e.target.value)}
    className={styles.input}
    required
  />
</div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Пароль</label>
        <input
          id="password"
          type="password"
          placeholder="Придумайте пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      <div className={styles.footerLinks}>
        <span>Уже есть аккаунт?</span>
        <Link to="/login" className={styles.link}>Войти</Link>
      </div>
    </form>
  );
};

export default RegisterForm;