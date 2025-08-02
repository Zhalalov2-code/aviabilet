import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, CircularProgress, Stack, Divider, Button } from '@mui/material';

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
      <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Детали бронирования
          </Typography>

          <Stack spacing={1}>
            <Typography><strong>Забронировано пользователем:</strong> {booking.booked_by}</Typography>
            <Typography><strong>Рейс №:</strong> {booking.flight_number}</Typography>
            <Typography><strong>Авиакомпания:</strong> {booking.airline}</Typography>
            <Typography><strong>Откуда:</strong> {booking.origin_city}</Typography>
            <Typography><strong>Куда:</strong> {booking.destination_city}</Typography>
            <Typography><strong>Дата вылета:</strong> {new Date(booking.departure_at).toLocaleString()}</Typography>
            <Typography><strong>Количество пассажиров:</strong> {booking.passengers}</Typography>
            <Typography><strong>Тип багажа:</strong> {booking.baggage === 'full' ? 'С багажом' : 'Ручная кладь'}</Typography>
            <Typography><strong>Итоговая сумма:</strong> {booking.total_price} €</Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/basket')}
          >
            Назад к корзине
          </Button>
        </Paper>
      </div>
    </>
  );
}

export default BookedFlightDetails;
