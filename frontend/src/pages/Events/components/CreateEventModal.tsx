import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/store';
import { addEvent, loadEvents } from '../../../store/slices/eventSlice';
import styles from './CreateEventModal.module.scss';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (eventData: { title: string; description: string; date: string; category: string }) => Promise<void>;
}

type FormData = {
  title: string;
  description: string;
  date: string;
  category: 'концерт' | 'лекция' | 'выставка';
};

const CreateEventModal = ({ onClose, onCreate }: CreateEventModalProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError: setFormError,
    setValue, // добавляем setValue для установки значения поля
  } = useForm<FormData>();

  useEffect(() => {
    // Устанавливаем текущую дату в формате YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    setValue('date', today);
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await onCreate(data);
      await dispatch(addEvent({ ...data, createdBy: user?.id || 'unknown' })).unwrap();
      await dispatch(loadEvents());
      reset();
      onClose();
    } catch (err: any) {
      setFormError('root', {
        type: 'manual',
        message: err.message || 'Произошла ошибка при создании',
      });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Создать новое мероприятие</h2>
        
        {errors.root && <div className={styles.errorMessage}>{errors.root.message}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="title">Название</label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Поле обязательно для заполнения' })}
              aria-invalid={errors.title ? 'true' : 'false'}
            />
            {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Поле обязательно для заполнения' })}
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && <span className={styles.fieldError}>{errors.description.message}</span>}
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Дата</label>
              <input
                id="date"
                type="date"
                {...register('date', { 
                  required: 'Поле обязательно для заполнения',
                  validate: value => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today || 'Дата должна быть сегодня или позже';
                  }
                })}
                aria-invalid={errors.date ? 'true' : 'false'}
              />
              {errors.date && <span className={styles.fieldError}>{errors.date.message}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                {...register('category', { required: 'Поле обязательно для заполнения' })}
                aria-invalid={errors.category ? 'true' : 'false'}
                className={errors.category ? styles.errorSelect : ''} 
              >
                <option value="">Выберите категорию</option>
                <option value="концерт">Концерт</option>
                <option value="лекция">Лекция</option>
                <option value="выставка">Выставка</option>
              </select>
              {errors.category && <span className={styles.fieldError}>{errors.category.message}</span>}
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
