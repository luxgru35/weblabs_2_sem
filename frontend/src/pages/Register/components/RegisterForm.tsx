import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@api/authService';
import { setToken } from '@utils/storage';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const { token } = await register(email, name, password);
      setToken(token);
      navigate('/events'); // Редирект после успешной регистрации
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;