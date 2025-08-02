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
      <div className="navbar-loading text-white text-center p-2">
        Загрузка навигации...
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

          <div className='col-2 d-flex justify-content-center align-items-center text-white'>
            <LocationOnIcon fontSize="small" className="me-1" />
            <span>{loadingCity ? 'Определяем...' : error || city}</span>
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

          <div className="col-2 d-flex justify-content-center align-items-center">
            <IconButton onClick={handleClick} size="small">
              <Avatar sx={{ width: 32, height: 32 }} src={profile?.avatar}>
                {!profile?.avatar && (profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '')}
              </Avatar>
              <span className='text-white ms-2'>Профиль</span>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {!user ? (
                <MenuItem onClick={handleClose}>
                  <Link to="/login" className="text-decoration-none text-dark">
                    Войти в аккаунт
                  </Link>
                </MenuItem>
              ) : (
                <>
                  <MenuItem onClick={handleClose}>
                    <Link to="/basket" className="text-decoration-none text-dark">
                      Мои билеты
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to="/profile" className="text-decoration-none text-dark">
                      Профиль
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
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
