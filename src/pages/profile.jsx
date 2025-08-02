import { useState, useEffect } from 'react';
import '../css/profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/auth';
import { FaEdit } from 'react-icons/fa';
import { auth } from '../firebase/firebase';
import CircularProgress from '@mui/material/CircularProgress';

const API_URL = 'https://6873df93c75558e27355818e.mockapi.io/users';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [editFields, setEditFields] = useState({
        avatar: false,
        name: false,
        lastname: false,
        telephone: false
    });

    useEffect(() => {
        const current = JSON.parse(localStorage.getItem('currentUser'));
        if (!current) return navigate('/login');

        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}?email=${current.email}`);
                const profile = res.data[0];
                if (!profile) {
                    localStorage.removeItem('currentUser');
                    return navigate('/login');
                }
                setUser(profile);
                setForm({ ...profile });
            } catch (err) {
                console.error('Ошибка при загрузке профиля:', err);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = (field) => {
        setEditFields(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSaveField = async (field) => {
        setLoading(true);
        try {
            const updated = await axios.put(`${API_URL}/${user.id}`, form);
            localStorage.setItem('currentUser', JSON.stringify(updated.data));
            alert(`${field} обновлён`);
            toggleEdit(field);
        } catch (err) {
            alert('Ошибка при обновлении');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Вы уверены, что хотите удалить профиль?")) {
            try {
                await axios.delete(`${API_URL}/${user.id}`);

                const firebaseUser = auth.currentUser;
                if (firebaseUser) {
                    await firebaseUser.delete();
                }

                await logoutUser();
                navigate('/login');
            } catch (error) {
                if (error.code === 'auth/requires-recent-login') {
                    alert('⚠️ Для удаления аккаунта нужно заново войти. Пожалуйста, выйдите и войдите снова.');
                } else {
                    console.error('Ошибка при удалении:', error);
                    alert('Произошла ошибка при удалении аккаунта.');
                }
            }
        }
    };

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <div className="profile-container">
                <h2>Профиль пользователя</h2>

                <div className="profile-photo-container">
                    <img src={form.avatar} alt="avatar" className="avatar-preview" />
                </div>

                <div className="field-group">
                    <label>Фото профиля</label>
                    <div className="field-inline">
                        <input
                            name="avatar"
                            value={form.avatar}
                            onChange={handleChange}
                            readOnly={!editFields.avatar}
                        />
                        <FaEdit className="edit-icon" onClick={() => toggleEdit('avatar')} />
                        {editFields.avatar && (
                            <button
                                className="update-btn"
                                onClick={() => handleSaveField('avatar')}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Сохранить'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="field-group">
                    <label>Имя</label>
                    <div className="field-inline">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            readOnly={!editFields.name}
                        />
                        <FaEdit className="edit-icon" onClick={() => toggleEdit('name')} />
                        {editFields.name && (
                            <button
                                className="update-btn"
                                onClick={() => handleSaveField('name')}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Сохранить'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="field-group">
                    <label>Фамилия</label>
                    <div className="field-inline">
                        <input
                            name="lastname"
                            value={form.lastname}
                            onChange={handleChange}
                            readOnly={!editFields.lastname}
                        />
                        <FaEdit className="edit-icon" onClick={() => toggleEdit('lastname')} />
                        {editFields.lastname && (
                            <button
                                className="update-btn"
                                onClick={() => handleSaveField('lastname')}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Сохранить'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="field-group">
                    <label>Телефон</label>
                    <div className="field-inline">
                        <input
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                            readOnly={!editFields.telephone}
                        />
                        <FaEdit className="edit-icon" onClick={() => toggleEdit('telephone')} />
                        {editFields.telephone && (
                            <button
                                className="update-btn"
                                onClick={() => handleSaveField('telephone')}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Сохранить'}
                            </button>
                        )}
                    </div>
                </div>

                <button onClick={handleDelete} className="delete-btn">
                    Удалить профиль
                </button>
            </div>
        </>
    );
}

export default Profile;
