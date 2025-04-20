import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { loadEvents, setCategory, addEvent, openModal, closeModal } from '../../store/slices/eventSlice';
import { loadUser } from '../../store/slices/userSlice';
import styles from './Events.module.scss';
import EventList from './components/EventList';
import CreateEventModal from './components/CreateEventModal';
import { Link } from 'react-router-dom';

const Events = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: events, loading, error, selectedCategory, isModalOpen } = useSelector(
    (state: RootState) => state.events
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(loadEvents());
    dispatch(loadUser());
  }, [dispatch]);

  const handleCreateEvent = async (eventData: {
    title: string;
    description: string;
    date: string;
    category: string;
  }) => {
    dispatch(addEvent({ ...eventData, createdBy: user?.id || 'unknown' }));
  };

  const filterEvents = (category: string) => {
    dispatch(setCategory(category));
  };

  const filteredEvents =
    selectedCategory === 'все'
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <div className={styles.eventsPage}>
      <div className={styles.backgroundAnimation}></div>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png"
            alt="Логотип"
            className={styles.logo}
          />
          <h1 className={styles.title}>
            Мои<span>Мероприятия</span>
          </h1>
        </div>

        {user ? (
          <div className={styles.userSection}>
            <div className={styles.userGreeting}>
              <span className={styles.welcome}>Добро пожаловать,</span>
              <span className={styles.userName}>{user.name}</span>
            </div>
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
              onChange={(e) => filterEvents(e.target.value)}
              className={styles.categoryFilter}
            >
              <option value="все">Все категории</option>
              <option value="концерт">Концерт</option>
              <option value="лекция">Лекция</option>
              <option value="выставка">Выставка</option>
            </select>
            {user && (
              <button
                onClick={() => dispatch(openModal())}
                className={styles.createButton}
              >
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