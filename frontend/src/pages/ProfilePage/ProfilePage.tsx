//ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUser } from '../../store/slices/authSlice';
import { loadEvents } from '../../store/slices/eventSlice';
import styles from './ProfilePage.module.scss';
import ProfileEditForm from './components/ProfileEditForm'; // Импортируем компонент формы
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, isError, errorMessage } = useAppSelector((state) => state.auth);
  const { items: events, loading: eventsLoading, error: eventsError } = useAppSelector((state) => state.events);
  const [isEditing, setIsEditing] = useState(false); // Состояние для переключения режима редактирования

  useEffect(() => {
    if (isAuthenticated) {
      if (!user) dispatch(fetchUser());
      dispatch(loadEvents());
    }
  }, [dispatch, isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.errorMessage}>Для просмотра профиля необходимо авторизоваться</div>
      </div>
    );
  }

  if (isLoading || eventsLoading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.errorMessage}>{errorMessage}</div>
      </div>
    );
  }

  const userEvents = events.filter(event => event.createdBy === user?.id);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.backgroundAnimation}></div>

      
      <div className={styles.profileContent}>
        <header className={styles.profileHeader}>
        <button 
    className={styles.backButton}
    onClick={() => navigate('/')}
    style={{ position: 'static', marginRight: '1rem' }} // Переопределяем стили
  >
    На главную
  </button>
          <h1 className={styles.profileTitle}>Профиль пользователя</h1>
          <p className={styles.profileSubtitle}>
            {isEditing ? 'Редактирование профиля' : 'Здесь вы можете управлять своими данными и просматривать созданные мероприятия'}
          </p>
        </header>

        <div className={styles.profileGrid}>
          <div className={styles.profileCard}>
            {isEditing ? (
              <ProfileEditForm 
                onCancel={() => setIsEditing(false)} 
                onSuccess={() => setIsEditing(false)}
              />
            ) : (
              <>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Личные данные</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                  >
                    Редактировать
                  </button>
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Полное имя</span>
                    <p className={styles.infoValue}>{user?.firstName} {user?.middleName} {user?.lastName}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email</span>
                    <p className={styles.infoValue}>{user?.email}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Пол</span>
                    <p className={styles.infoValue}>{user?.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Дата рождения</span>
                    <p className={styles.infoValue}>
                      {user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Не указана'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={styles.profileCard}>
            <div className={styles.eventsSection}>
              <div className={styles.eventsHeader}>
                <h2 className={styles.cardTitle}>Мои мероприятия</h2>
                <span className={styles.eventsCount}>{userEvents.length}</span>
              </div>
              
              {eventsError && (
                <div className={styles.errorMessage}>{eventsError}</div>
              )}

              {userEvents.length > 0 ? (
                <ul className={styles.eventsList}>
                  {userEvents.map((event, index) => (
                    <li key={event.id} className={styles.eventCard} style={{ animationDelay: `${index * 0.1}s` }}>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <div className={styles.eventMeta}>
                        <span className={styles.eventCategory}>{event.category}</span>
                        <span className={styles.eventDate}>
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      {event.description && (
                        <p className={styles.eventDescription}>{event.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📅</div>
                  <h3>Нет созданных мероприятий</h3>
                  <p className={styles.emptyText}>
                    Вы еще не создали ни одного мероприятия. Начните прямо сейчас!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;