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
            // Можно добавить уведомление пользователю
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
            console.error("Ошибка при добавлении в корзину:", err);
            alert("Ошибка при добавлении в корзину. Попробуйте позже.");
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
            <div style={{ 
                maxWidth: 900, 
                margin: 'var(--spacing-12) auto', 
                padding: 'var(--spacing-6)',
                background: 'var(--white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
                }}></div>
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
                        ✈️ Детали рейса
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
                            🛫 <strong>Рейс №:</strong> {flight.flight_number}
                        </Typography>
                        <Typography sx={{ 
                            fontSize: 'var(--font-size-lg)', 
                            fontWeight: 600,
                            color: 'var(--gray-700)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            🏢 <strong>Авиакомпания:</strong> {flight.airline}
                        </Typography>
                        <Typography sx={{ 
                            fontSize: 'var(--font-size-lg)', 
                            fontWeight: 600,
                            color: 'var(--gray-700)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            🛫 <strong>Откуда:</strong> {flight.origin_city} ({flight.origin_airport})
                        </Typography>
                        <Typography sx={{ 
                            fontSize: 'var(--font-size-lg)', 
                            fontWeight: 600,
                            color: 'var(--gray-700)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            🛬 <strong>Куда:</strong> {flight.destination_city} ({flight.destination_airport})
                        </Typography>
                        <Typography sx={{ 
                            fontSize: 'var(--font-size-lg)', 
                            fontWeight: 600,
                            color: 'var(--gray-700)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            🕐 <strong>Дата вылета:</strong> {new Date(flight.departure_at).toLocaleString()}
                        </Typography>
                        <Typography sx={{ 
                            fontSize: 'var(--font-size-xl)', 
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, var(--secondary-color) 0%, #4a9bd8 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            💰 <strong>Цена за пассажира:</strong> {flight.price} €
                        </Typography>
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h5" sx={{ 
                        mb: 3,
                        fontWeight: 600,
                        color: 'var(--primary-color)',
                        textAlign: 'center'
                    }}>
                        🎫 Настройки бронирования
                    </Typography>

                    <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                        <TextField
                            label="👥 Количество пассажиров"
                            type="number"
                            value={passengers}
                            onChange={(e) => setPassengers(Number(e.target.value))}
                            inputProps={{ min: 1, max: 10 }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 'var(--radius-md)',
                                    '&:hover': {
                                        borderColor: 'var(--gray-300)'
                                    },
                                    '&.Mui-focused': {
                                        borderColor: 'var(--secondary-color)',
                                        boxShadow: '0 0 0 3px rgba(89, 171, 232, 0.1)'
                                    }
                                }
                            }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 4 }}>
                        <InputLabel>🧳 Тип багажа</InputLabel>
                        <Select
                            value={baggage}
                            onChange={(e) => setBaggage(e.target.value)}
                            sx={{
                                borderRadius: 'var(--radius-md)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--gray-200)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--gray-300)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--secondary-color)'
                                }
                            }}
                        >
                            <MenuItem value="hand">🛍️ Ручная кладь (0 €)</MenuItem>
                            <MenuItem value="full">🧳 С багажом (+25 €)</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography sx={{ 
                        mt: 3, 
                        mb: 4,
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 700,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, var(--success-color) 0%, #45a049 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        💰 Итоговая сумма: {totalPrice} €
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ 
                            mt: 3,
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
                        onClick={handleAddToBasket}
                    >
                        🎫 Забронировать билет
                    </Button>
                </Paper>

                <Dialog 
                    open={openModal} 
                    onClose={() => setOpenModal(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-xl)',
                            maxWidth: 500
                        }
                    }}
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 600
                    }}>
                        🔐 Неавторизованный пользователь
                    </DialogTitle>
                    <DialogContent sx={{ py: 3, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Чтобы забронировать билет, необходимо войти в аккаунт.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <Button 
                            onClick={() => setOpenModal(false)}
                            variant="outlined"
                            sx={{
                                borderColor: 'var(--gray-300)',
                                color: 'var(--gray-600)',
                                '&:hover': {
                                    borderColor: 'var(--gray-400)',
                                    backgroundColor: 'var(--gray-50)'
                                }
                            }}
                        >
                            Отмена
                        </Button>
                        <Button 
                            onClick={() => navigate('/login')} 
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
                                color: 'white',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: 'var(--shadow-md)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
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
