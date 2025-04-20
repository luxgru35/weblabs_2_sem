//profileeditform
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateUserProfile } from '../../../store/slices/authSlice';
import styles from './ProfileEditForm.module.scss';

// Добавляем интерфейс для пропсов
interface ProfileEditFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// Указываем тип пропсов в компоненте
const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onCancel, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    gender: user?.gender || 'male',
    birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await dispatch(updateUserProfile({
        userId: Number(user.id),
        userData: formData
      })).unwrap();
      onSuccess(); // Вызываем после успешного обновления
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formGroup}>
        <label>Имя</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Фамилия</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Пол</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Дата рождения</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formActions}>
        <button 
          type="button" 
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Отмена
        </button>
        <button type="submit" className={styles.submitButton}>
          Сохранить изменения
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;