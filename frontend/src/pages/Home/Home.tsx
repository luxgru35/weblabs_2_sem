import { useEffect, useState } from "react";

import { useAppDispatch,useAppSelector } from "../../store/hooks";
import { checkAuthToken, logoutUser } from "../../store/slices/authSlice"; // импортируем необходимые экшены
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    dispatch(checkAuthToken());
  }, [dispatch]);
  

  const handleLogout = () => {
    dispatch(logoutUser()); 
  };

  

  return (
    <div className={styles.homePage}>
      <div className={styles.backgroundAnimation}></div>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png"
            alt="Logo"
            className={styles.logo}
          />
          <h1 className={styles.title}>Мои<span>Мероприятия</span></h1>
        </div>

        <p className={styles.subtitle}>
          Революционизируйте процесс управления мероприятиями. Создавайте, организуйте и 
          отслеживайте события с беспрецедентной легкостью и эффективностью.
        </p>

        {isLoading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
          </div>
        ) : isAuthenticated ? (
          <div className={styles.userSection}>
            <div className={styles.userGreeting}>
              <span className={styles.welcome}>Добро пожаловать обратно,</span>
              <span className={styles.userName}>{user?.name}</span>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Выйти
              </button>
              <Link to="/events">
                <button className={styles.primaryButton}>
                  Перейти в панель управления
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.authSection}>
            <div className={styles.authButtons}>
              <Link to="/login">
                <button className={styles.authButton}>
                  Войти
                </button>
              </Link>
              <Link to="/register">
                <button
                  className={`${styles.authButton} ${styles.registerButton}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered ? "Начать →" : "Создать аккаунт"}
                </button>
              </Link>
            </div>
            <div className={styles.quickAccess}>
              <Link to="/events">
                <button className={styles.quickLink}>
                  Просмотреть мероприятия как гость
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📅</div>
          <h3>Легкое планирование</h3>
          <p>Создавайте и управляйте мероприятиями за считанные минуты с нашим интуитивно понятным интерфейсом.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>👥</div>
          <h3>Управление гостями</h3>
          <p>Отслеживайте участников и отправляйте автоматические приглашения и напоминания.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📊</div>
          <h3>Аналитика в реальном времени</h3>
          <p>Получайте инсайты о производительности вашего мероприятия и посещаемости.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
