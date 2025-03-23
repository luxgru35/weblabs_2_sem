import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;