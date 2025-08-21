import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, CircularProgress, Stack, Divider, Button } from '@mui/material';
import '../css/bookedTicketDetails.css'

const BASKET_URL = 'https://6873df93c75558e27355818e.mockapi.io/basket';

function BookedFlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${BASKET_URL}/${id}`);
        setBooking(res.data);
              } catch (err) {
            console.error('Ошибка при получении данных бронирования:', err);
            // Можно добавить уведомление пользователю
        } finally {
            setLoading(false);
        }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <CircularProgress />
      </div>
    );
  }

  if (!booking) {
    return <Typography align="center" mt={10}>Бронирование не найдено</Typography>;
  }

  return (
    <>
      <div className="booked-container">
        <Paper elevation={0} sx={{ 
          p: 6, 
          borderRadius: 3,
          background: 'transparent'
        }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              textAlign: 'center',
              mb: 4
            }}
          >
            📋 Детали бронирования
          </Typography>

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              👤 <strong>Забронировано пользователем:</strong> {booking.booked_by}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              🛫 <strong>Рейс №:</strong> {booking.flight_number}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              🏢 <strong>Авиакомпания:</strong> {booking.airline}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              🛫 <strong>Откуда:</strong> {booking.origin_city}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              🛬 <strong>Куда:</strong> {booking.destination_city}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              🕐 <strong>Дата вылета:</strong> {new Date(booking.departure_at).toLocaleString()}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              👥 <strong>Количество пассажиров:</strong> {booking.passengers}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 600,
              color: 'var(--gray-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              🧳 <strong>Тип багажа:</strong> {booking.baggage === 'full' ? 'С багажом' : 'Ручная кладь'}
            </Typography>
            <Typography sx={{ 
              fontSize: 'var(--font-size-xl)', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--success-color) 0%, #45a049 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              💰 <strong>Итоговая сумма:</strong> {booking.total_price} €
            </Typography>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Button
            variant="contained"
            fullWidth
            sx={{ 
              mt: 2,
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: 'var(--font-size-lg)',
              py: 2,
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: 'var(--shadow-lg)'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/basket')}
          >
            🛒 Назад к корзине
          </Button>
        </Paper>
      </div>
    </>
  );

}

export default BookedFlightDetails;
