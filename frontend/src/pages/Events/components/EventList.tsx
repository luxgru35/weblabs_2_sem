//EventList.tsx
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/store';
import { loadEvents, removeEvent, updateEventThunk } from '../../../store/slices/eventSlice';
import styles from './EventList.module.scss';
import { Event } from '../../../types/event';
import { FC } from 'react';

interface EventListProps {
  events: Event[];
  onEventUpdate: () => void;
  user: any;
}
const EventList: FC<EventListProps> = (props) => {
  const dispatch = useAppDispatch();
  const { events } = props;
  const { user } = useAppSelector((state: RootState) => state.user);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      await dispatch(removeEvent(eventToDelete)).unwrap();
      await dispatch(loadEvents());
    } catch (e) {
      setError('Ошибка при удалении мероприятия');
    } finally {
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0],
      category: event.category
    });
    setError('');
  };
  

  const handleSave = async () => {
    if (!editingEvent) return;
    if (!['концерт', 'лекция', 'выставка'].includes(formData.category)) {
      setError('Выберите допустимую категорию: концерт, лекция или выставка');
      return;
    }

    try {
      await dispatch(updateEventThunk({ id: editingEvent.id, eventData: formData })).unwrap();
      setEditingEvent(null);
      await dispatch(loadEvents());
    } catch (e: any) {
      if (e.message === 'Недопустимая категория') {
        setError('Выберите допустимую категорию');
      } else if (e.message === 'Forbidden') {
        setError('Можно редактировать только свои мероприятия');
      } else {
        setError('Ошибка при обновлении мероприятия');
      }
    }
  };

  return (
    <>
      {error && (
        <div className={styles.errorBanner} onClick={() => setError('')}>
          {error}
          <span className={styles.closeError}>×</span>
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <p>Вы уверены, что хотите удалить мероприятие?</p>
            <div className={styles.confirmationButtons}>
              <button 
                onClick={handleDelete}
                className={styles.confirmButton}
              >
                Удалить
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
            alt="Нет мероприятий" 
            className={styles.emptyIcon}
          />
          <h3>Мероприятий пока нет</h3>
        </div>
      ) : (
        <ul className={styles.eventList}>
          {events.map((event) => (
            <li key={event.id} className={styles.eventCard}>
              {editingEvent?.id === event.id ? (
                <div className={styles.editForm}>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Название"
                    className={styles.inputField}
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Описание"
                    className={styles.textareaField}
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className={styles.inputField}
                  />
                  <select
  value={formData.category}
  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
  className={styles.inputField}
>
  <option value="">Выберите категорию</option>
  <option value="концерт">Концерт</option>
  <option value="лекция">Лекция</option>
  <option value="выставка">Выставка</option>
</select>

                  <div className={styles.formActions}>
                    <button onClick={handleSave} className={styles.saveButton}>
                      Сохранить
                    </button>
                    <button 
                      onClick={() => setEditingEvent(null)} 
                      className={styles.cancelButton}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.eventHeader}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    {event.createdBy && (
                      <span className={styles.eventAuthor}>Автор: {event.createdBy}</span>
                    )}
                  </div>
                  <p className={styles.eventDescription}>{event.description}</p>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventDate}>
                      📅 {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className={styles.eventCategory}>🏷️ {event.category}</span>
                  </div>
                  <div className={styles.eventActions}>
                    {user && (user.role === 'admin' || event.createdBy === user.id) && (
                      <>
                        <button 
                          onClick={() => handleEdit(event)} 
                          className={styles.editButton}
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(event.id)} 
                          className={styles.deleteButton}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default EventList;