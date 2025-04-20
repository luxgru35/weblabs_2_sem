// CreateEventModal.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { addEvent, loadEvents } from '../../../store/slices/eventSlice';
import styles from './CreateEventModal.module.scss';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (eventData: { title: string; description: string; date: string; category: string }) => Promise<void>;
}

const CreateEventModal = ({ onClose }: CreateEventModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '' as 'концерт' | 'лекция' | 'выставка' | ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.category || !['концерт', 'лекция', 'выставка'].includes(formData.category)) {
      setError('Пожалуйста, выберите допустимую категорию');
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(addEvent({ ...formData, createdBy: user?.id || 'unknown' })).unwrap();
      await dispatch(loadEvents());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при создании');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Создать новое мероприятие</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Дата</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={!formData.category ? styles.emptySelect : ''}
              >
                <option value="">Выберите категорию</option>
                <option value="концерт">Концерт</option>
                <option value="лекция">Лекция</option>
                <option value="выставка">Выставка</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Создание...' : 'Создать мероприятие'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;