import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerUser } from '../../../store/slices/authSlice';
import styles from './RegisterForm.module.scss';

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(formData)).unwrap();
      navigate('/login');
    } catch {
      // Ошибка уже обработана в Redux
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Введите ваш email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Имя пользователя</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Введите имя пользователя"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="firstName" className={styles.label}>Имя</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Введите имя"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="lastName" className={styles.label}>Фамилия</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Введите фамилию"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="middleName" className={styles.label}>Отчество (необязательно)</label>
        <input
          id="middleName"
          name="middleName"
          type="text"
          placeholder="Введите отчество"
          value={formData.middleName}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="gender" className={styles.label}>Пол</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
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
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Пароль</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Придумайте пароль"
          value={formData.password}
          onChange={handleChange}
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