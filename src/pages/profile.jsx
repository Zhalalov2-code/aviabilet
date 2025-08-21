import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import axios from 'axios';
import { logoutUser } from '../utils/auth';
import { FaEdit } from 'react-icons/fa';
import { auth } from '../firebase/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import '../css/profile.css';

const API_URL = 'https://6873df93c75558e27355818e.mockapi.io/users';

function Profile() {
    const navigate = useNavigate();
    const { user, profile, loading } = useAuth();
    const [form, setForm] = useState(null);
    const [editFields, setEditFields] = useState({
        avatar: false,
        name: false,
        lastname: false,
        telephone: false
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!loading && profile) {
            setForm({ ...profile });
            return;
        }

        if (!loading && user && !profile) {
            try {
                const saved = localStorage.getItem('currentUser');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed && typeof parsed === 'object' && parsed.id) {
                        setForm(parsed);
                    }
                }
            } catch (error) {
                console.warn('Ошибка при загрузке данных из localStorage:', error);
            }
        }

        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user, profile, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = (field) => {
        setEditFields(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSaveField = async (field) => {
        setUpdating(true);
        try {
            const updated = await axios.put(`${API_URL}/${form?.id || profile?.id}`, form);
            setForm(updated.data);

            try {
                localStorage.setItem('currentUser', JSON.stringify(updated.data));
            } catch (error) {
                console.warn('Не удалось сохранить обновленные данные в localStorage:', error);
            }

            alert(`${field} обновлён`);
            toggleEdit(field);
        } catch (err) {
            alert('Ошибка при обновлении');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Вы уверены, что хотите удалить профиль?")) {
            try {
                const targetId = form?.id || profile?.id;
                if (!targetId) { alert('ID профиля не найден. Попробуйте обновить страницу.'); return; }
                await axios.delete(`${API_URL}/${targetId}`);
                const firebaseUser = auth.currentUser;
                if (firebaseUser) {
                    await firebaseUser.delete();
                }

                await logoutUser();
                try {
                    localStorage.removeItem('currentUser');
                } catch (error) {
                    console.warn('Не удалось удалить данные из localStorage:', error);
                }

                navigate('/login');
            } catch (error) {
                if (error.code === 'auth/requires-recent-login') {
                    alert('⚠️ Для удаления аккаунта нужно заново войти. Пожалуйста, выйдите и войдите снова.');
                } else {
                    alert('Произошла ошибка при удалении аккаунта.');
                }
            }
        }
    };

    if (loading || !form) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h2 style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: 'var(--font-size-3xl)',
                textAlign: 'center',
                marginBottom: 'var(--spacing-8)'
            }}>
                👤 Профиль пользователя
            </h2>

            <div className="profile-photo-container">
                <img src={form.avatar} alt="avatar" className="avatar-preview" />
            </div>

            {['avatar', 'name', 'lastname', 'telephone'].map(field => (
                <div className="field-group" key={field}>
                    <label>
                        {field === 'avatar' ? '🖼️ Фото профиля' : 
                         field === 'name' ? '👤 Имя' : 
                         field === 'lastname' ? '👤 Фамилия' : 
                         '📱 Телефон'}
                    </label>
                    <div className="field-inline">
                        <input
                            name={field}
                            value={form[field] || ''}
                            onChange={handleChange}
                            readOnly={!editFields[field]}
                            placeholder={field === 'avatar' ? 'Ссылка на фото' : 
                                       field === 'name' ? 'Введите имя' : 
                                       field === 'lastname' ? 'Введите фамилию' : 
                                       'Введите телефон'}
                        />
                        <FaEdit 
                            className="edit-icon" 
                            onClick={() => toggleEdit(field)}
                            title={editFields[field] ? 'Отменить редактирование' : 'Редактировать'}
                        />
                        {editFields[field] && (
                            <button
                                className="update-btn"
                                onClick={() => handleSaveField(field)}
                                disabled={updating}
                            >
                                {updating ? <CircularProgress size={20} /> : '💾 Сохранить'}
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <button onClick={handleDelete} className="delete-btn">
                🗑️ Удалить профиль
            </button>
        </div>
    );
}

export default Profile;
