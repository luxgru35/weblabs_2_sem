import styles from './Register.module.scss';
import RegisterForm from './components/RegisterForm';

const Register = () => {
  return (
    <div className={styles.registerPage}>
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;