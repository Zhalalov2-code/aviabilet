import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import Icon from '../img/air-express.png';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../utils/authContext';
import { logoutUser } from '../utils/auth';
import { getUserCity } from "../utils/getCurrentCity";

function Navbar() {
  const [city, setCity] = useState('');
  const [loadingCity, setLoadingCity] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { user, profile, loading } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert('Ошибка при выходе из системы. Попробуйте еще раз.');
    } finally {
      handleClose();
      window.location.reload();
    }
  };

  useEffect(() => {
    getUserCity()
      .then((userCity) => {
        if (userCity) setCity(userCity);
      })
      .catch((err) => {
        setError('Ошибка геолокации');
        console.error('Ошибка:', err);
      })
      .finally(() => setLoadingCity(false));
  }, []);

  if (loading) {
    return (
      <div className="navbar-loading">
        <span style={{ position: 'relative', zIndex: 2 }}>🔄 Загрузка навигации...</span>
      </div>
    );
  }

  return (
    <div className='body'>
      <div className='container h-100'>
        <div className='row h-100 align-items-center'>

          <div className='col-2 d-flex justify-content-center align-items-center'>
            <img className='icon-img' src={Icon} alt="icon" title="Air Express" />
          </div>

          <div className='col-2 d-flex justify-content-center align-items-center'>
            <div className='city-display d-flex align-items-center'>
              <LocationOnIcon fontSize="small" />
              <span>{loadingCity ? '📍 Определяем...' : error ? '❌ Ошибка' : ` ${city}`}</span>
            </div>
          </div>

          <div className='col-4 d-flex justify-content-center align-items-center'>
            <div className='section-1 d-flex justify-content-between align-items-center w-100'>
              <div className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}>
                <Link to="/"><p className="m-0 mt-1">Главная</p></Link>
              </div>
              <div className={`nav-tab ${location.pathname === '/booking' ? 'active' : ''}`}>
                <Link to="/booking"><p className="m-0 mt-1">Авиабилеты</p></Link>
              </div>
              <div className={`nav-tab ${location.pathname === '/basket' ? 'active' : ''}`}>
                <Link to="/basket"><p className="m-0 mt-1">Корзина</p></Link>
              </div>
            </div>
          </div>

          <div className="col-2 d-flex justify-content-center align-items-center profile-section">
            <IconButton 
              onClick={handleClick} 
              size="small"
              className="profile-button"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2) !important'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }} 
                src={profile?.avatar}
              >
                {!profile?.avatar && (profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '👤')}
              </Avatar>
              <span className='profile-text'>Профиль</span>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--gray-200)',
                  mt: 1,
                  minWidth: 200
                }
              }}
            >
              {!user ? (
                <MenuItem 
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'var(--gray-50)'
                    }
                  }}
                >
                  <Link to="/login" className="text-decoration-none text-dark d-flex align-items-center">
                    🔐 Войти в аккаунт
                  </Link>
                </MenuItem>
              ) : (
                <>
                  <MenuItem 
                    onClick={handleClose}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'var(--gray-50)'
                      }
                    }}
                  >
                    <Link to="/basket" className="text-decoration-none text-dark d-flex align-items-center">
                      🎫 Мои билеты
                    </Link>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleClose}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'var(--gray-50)'
                      }
                    }}
                  >
                    <Link to="/profile" className="text-decoration-none text-dark d-flex align-items-center">
                      👤 Профиль
                    </Link>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      color: 'var(--error-color)',
                      '&:hover': {
                        backgroundColor: 'rgba(220, 53, 69, 0.1)'
                      }
                    }}
                  >
                    🚪 Выйти
                  </MenuItem>
                </>
              )}
            </Menu>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Navbar;
