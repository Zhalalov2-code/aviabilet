import { useState } from "react";
import Navbar from "../components/navbar";
import '../css/register.css';
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from '../utils/auth';

function Register() {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    telephone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Имя обязательно";
    if (!form.lastname.trim()) newErrors.lastname = "Фамилия обязательна";
    if (!form.email.includes("@") || !form.email.includes(".")) newErrors.email = "Некорректный email";
    if (form.password.length < 6) newErrors.password = "Пароль минимум 6 символов";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Пароли не совпадают";
    if (!/[A-Z]/.test(form.password)) newErrors.password = "Пароль должен содержать заглавную букву";
    if (!/[0-9]/.test(form.password)) newErrors.password = "Пароль должен содержать цифру";
    if (!/[!.-]/.test(form.password)) newErrors.password = "Пароль должен содержать символ (! . -)";
    if (!/^\d{10,}$/.test(form.telephone)) newErrors.telephone = "Телефон должен содержать минимум 10 цифр";
    try {
      new URL(form.avatar);
    } catch {
      newErrors.avatar = "Ссылка на аватар некорректна";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await registerUser(
        form.email,
        form.password,
        {
          name: form.name,
          lastname: form.lastname,
          avatar: form.avatar,
          telephone: form.telephone
        }
      );

      alert('Регистрация успешна!');
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        alert('Пользователь с таким email уже существует');
      } else {
        alert('Ошибка регистрации. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="section-register-1">
          <h2>Регистрация</h2>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="field-group">
              <label>Имя</label>
              <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Введите имя" />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="field-group">
              <label>Фамилия</label>
              <input name="lastname" value={form.lastname} onChange={handleChange} type="text" placeholder="Введите фамилию" />
              {errors.lastname && <span className="error">{errors.lastname}</span>}
            </div>

            <div className="field-group">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Введите email" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="field-group">
              <label>Пароль</label>
              <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Введите пароль" />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="field-group">
              <label>Подтвердите пароль</label>
              <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Повторите пароль" />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <div className="field-group">
              <label>Телефон</label>
              <input name="telephone" value={form.telephone} onChange={handleChange} type="text" placeholder="Введите телефон" />
              {errors.telephone && <span className="error">{errors.telephone}</span>}
            </div>

            <div className="field-group">
              <label>Аватар (URL)</label>
              <input name="avatar" value={form.avatar} onChange={handleChange} type="text" placeholder="Ссылка на аватар" />
              {errors.avatar && <span className="error">{errors.avatar}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>

            <Link to={'/login'} className="link-login">
              Уже есть аккаунт? Войти
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
