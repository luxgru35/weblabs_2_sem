import styles from './Login.module.scss';
import LoginForm from './components/LoginForm/LoginForm';

const Login = () => {
  return (
    <div className={styles.loginPage}>
      <h1>Login Page</h1>
      <LoginForm />
    </div>
  );
};

export default Login;