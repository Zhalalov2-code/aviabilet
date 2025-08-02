import { useState } from 'react';
import '../css/login.css';
import { Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../utils/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!email.trim()) validationErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Некорректный email';

    if (!password) validationErrors.password = 'Пароль обязателен';
    else if (password.length < 6) validationErrors.password = 'Пароль должен быть не менее 6 символов';

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        await loginUser(email, password);
        setOpen(true);
        setTimeout(() => navigate('/'), 1000);
      } catch (err) {
        setErrors({ general: 'Неверный email или пароль' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      setOpen(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setErrors({ general: 'Ошибка входа через Google' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container">
        <form className="section-login-1" onSubmit={handleSubmit}>
          <h2>Вход в систему</h2>

          <label>Email</label>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <small className="error" style={{ color: 'red' }}>{errors.email}</small>}

          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <small className="error" style={{ color: 'red' }}>{errors.password}</small>}

          {errors.general && <div className="error" style={{ color: 'red' }}>{errors.general}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>

          <Link className='link-register' to={'/register'}>У вас нету аккаунта? Создать аккаунт</Link>

          <p className='text-center'>Или вход через</p>

          <button type="button" onClick={handleGoogleLogin} disabled={loading}>Google</button>
        </form>
      </div>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Успешный вход!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;