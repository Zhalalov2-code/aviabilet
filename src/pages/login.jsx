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
          <h2>Добро пожаловать</h2>

          <label>Email</label>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <small className="error">{errors.email}</small>}

          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <small className="error">{errors.password}</small>}

          {errors.general && <div className="error">{errors.general}</div>}

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                Загрузка...
              </>
            ) : (
              'Войти в систему'
            )}
          </button>

          <Link className='link-register' to={'/register'}>У вас нет аккаунта? Создать аккаунт</Link>

          <p className='text-center'>Или вход через</p>

          <button type="button" onClick={handleGoogleLogin} disabled={loading} style={{
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-3) var(--spacing-6)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-base)',
            fontWeight: 600,
            transition: 'all var(--transition-normal)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#4285f4'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
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