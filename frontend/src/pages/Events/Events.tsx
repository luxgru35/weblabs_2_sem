import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadEvents,
  setCategory,
  addEvent,
  openModal,
  closeModal,
} from '../../store/slices/eventSlice';
import { loadUser } from '../../store/slices/userSlice';
import styles from './Events.module.scss';
import EventList from './components/EventList';
import CreateEventModal from './components/CreateEventModal';
import { Link } from 'react-router-dom';
import { Event } from '../../types/event';

const Events = () => {
  const dispatch = useAppDispatch();
  const {
    items: events,
    loading,
    error,
    selectedCategory,
    isModalOpen,
  } = useAppSelector((state) => state.events);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadEvents());
    dispatch(loadUser());
  }, [dispatch]);

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'createdBy'>): Promise<void> => {
    await dispatch(addEvent({ ...eventData, createdBy: user?.id || 'unknown' }));
  };

  const filteredEvents = useMemo(() => {
    return selectedCategory === 'все'
      ? events
      : events.filter((event) => event.category === selectedCategory);
  }, [events, selectedCategory]);

  return (
    <div className={styles.eventsPage}>
      <div className={styles.backgroundAnimation}></div>

      <header className={styles.header}>
        <Link to="/" className={styles.logoContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png"
            alt="Логотип"
            className={styles.logo}
          />
          <h1 className={styles.title}>
            Мои<span>Мероприятия</span>
          </h1>
        </Link>

        {user ? (
          <div className={styles.userSection}>
            <Link to="/profile" className={styles.profileButton}>
              <div className={styles.userGreeting}>
                <span className={styles.welcome}>Добро пожаловать,</span>
                <span className={styles.userName}>{user.name}</span>
              </div>
            </Link>
          </div>
        ) : (
          <div className={styles.authSection}>
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.authButton}>
                Войти
              </Link>
              <Link to="/register" className={`${styles.authButton} ${styles.registerButton}`}>
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actionsBar}>
          <h2 className={styles.sectionTitle}>Все мероприятия</h2>
          <div className={styles.filterControls}>
            <select
              value={selectedCategory}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              className={styles.categoryFilter}
            >
              <option value="все">Все категории</option>
              <option value="концерт">Концерт</option>
              <option value="лекция">Лекция</option>
              <option value="выставка">Выставка</option>
            </select>
            {user && (
              <button onClick={() => dispatch(openModal())} className={styles.createButton}>
                + Создать мероприятие
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Загрузка мероприятий...</p>
          </div>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <EventList
            events={filteredEvents}
            onEventUpdate={() => dispatch(loadEvents())}
            user={user}
          />
        )}

        {isModalOpen && (
          <CreateEventModal
            onClose={() => dispatch(closeModal())}
            onCreate={handleCreateEvent}
          />
        )}
      </main>
    </div>
  );
};

export default Events;