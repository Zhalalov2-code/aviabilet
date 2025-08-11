import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Paper, Typography, Stack, Divider } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../utils/authContext';

const API_URL = 'https://6873df93c75558e27355818e.mockapi.io/tickets';
const BASKET_URL = 'https://6873df93c75558e27355818e.mockapi.io/basket';

function FlightDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile, loading } = useAuth();

    const [flight, setFlight] = useState(null);
    const [flightLoading, setFlightLoading] = useState(true);
    const [passengers, setPassengers] = useState(1);
    const [baggage, setBaggage] = useState('hand');
    const [openModal, setOpenModal] = useState(false);
    const [snackbar, setSnackbar] = useState(false);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const res = await axios.get(`${API_URL}/${id}`);
                setFlight(res.data);
            } catch (err) {
                console.error('Ошибка при получении данных билета:', err);
            } finally {
                setFlightLoading(false);
            }
        };

        fetchFlight();
    }, [id]);

    const baggagePrice = baggage === 'full' ? 25 : 0;
    const totalPrice = flight ? (flight.price + baggagePrice) * passengers : 0;

    const handleAddToBasket = async () => {
        if (loading) return;

        if (!user) {
            setOpenModal(true);
            return;
        }

        let effectiveProfile = profile;
        if (!effectiveProfile) {
            try {
                const saved = localStorage.getItem('currentUser');
                if (saved) effectiveProfile = JSON.parse(saved);
            } catch { }
        }

        try {
            await axios.post(BASKET_URL, {
                flight_number: flight.flight_number,
                airline: flight.airline,
                origin_city: flight.origin_city,
                destination_city: flight.destination_city,
                departure_at: flight.departure_at,
                passengers,
                baggage,
                total_price: totalPrice,
                booked_by: (effectiveProfile && effectiveProfile.name) || user.displayName || '',
                uid: user.uid
            });
            setSnackbar(true);
        } catch (err) {
            alert("Ошибка при добавлении в корзину");
        }
    };


    if (loading || flightLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                <CircularProgress />
            </div>
        );
    }

    if (!flight) {
        return <Typography align="center" mt={10}>Билет не найден</Typography>;
    }

    return (
        <>
            <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
                <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Детали рейса
                    </Typography>

                    <Stack spacing={1}>
                        <Typography><strong>Рейс №:</strong> {flight.flight_number}</Typography>
                        <Typography><strong>Авиакомпания:</strong> {flight.airline}</Typography>
                        <Typography><strong>Откуда:</strong> {flight.origin_city} ({flight.origin_airport})</Typography>
                        <Typography><strong>Куда:</strong> {flight.destination_city} ({flight.destination_airport})</Typography>
                        <Typography><strong>Дата вылета:</strong> {new Date(flight.departure_at).toLocaleString()}</Typography>
                        <Typography><strong>Цена за пассажира:</strong> {flight.price} €</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Количество пассажиров"
                            type="number"
                            value={passengers}
                            onChange={(e) => setPassengers(Number(e.target.value))}
                            inputProps={{ min: 1 }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Багаж</InputLabel>
                        <Select
                            value={baggage}
                            onChange={(e) => setBaggage(e.target.value)}
                        >
                            <MenuItem value="hand">Ручная кладь (0 €)</MenuItem>
                            <MenuItem value="full">С багажом (+25 €)</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography sx={{ mt: 2 }} variant="h6">
                        Итоговая сумма: {totalPrice} €
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={handleAddToBasket}
                    >
                        Забронировать
                    </Button>
                </Paper>

                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <DialogTitle>Неавторизованный пользователь</DialogTitle>
                    <DialogContent>
                        Чтобы забронировать билет, необходимо войти в аккаунт.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)}>Отмена</Button>
                        <Button onClick={() => navigate('/login')} variant="contained" color="primary">
                            Войти
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar(false)}
                    message="✅ Билет добавлен в корзину"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </div>
        </>
    );
}

export default FlightDetails;
