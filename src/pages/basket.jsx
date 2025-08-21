import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Paper, Typography, IconButton, Divider, CircularProgress, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../utils/authContext";
import { useNavigate } from "react-router-dom";
import '../css/basket.css';

const BASKET_API = "https://6873df93c75558e27355818e.mockapi.io/basket";

function Basket() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchBasket = useCallback(async () => {
        try {
            const res = await axios.get(BASKET_API);
            const filtered = res.data.filter(item => item.uid === user?.uid);
            setItems(filtered);
        } catch (err) {
            console.error("Ошибка при загрузке корзины:", err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASKET_API}/${id}`);
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            alert("Ошибка при удалении");
        }
    };

    useEffect(() => {
        if (user) {
            fetchBasket();
        } else {
            setLoading(false);
        }
    }, [user, fetchBasket]);

    const totalSum = items.reduce((acc, item) => acc + Number(item.total_price), 0);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
                <CircularProgress />
            </div>

        );
    }

    if (!user) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 10 }}>
                🛑 Чтобы просматривать корзину, войдите в аккаунт
            </Typography>

        );
    }

    if (!items.length) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 10 }}>
                🛒 Ваша корзина пуста
            </Typography>
        );
    }

    return (
        <>
            <div className="basket-container">
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
                    🛒 Моя корзина
                </Typography>

                {items.map((item) => (
                    <Paper
                        key={item.id}
                        elevation={3}
                        className="basket-item"
                    >
                        <div className="basket-item-content">
                            <div className="basket-item-details">
                                <Typography variant="h6" className="basket-item-title">
                                    ✈️ Рейс № {item.flight_number} — {item.airline}
                                </Typography>
                                <Typography variant="body2" className="basket-item-route">
                                    🛫 {item.origin_city} → 🛬 {item.destination_city}
                                </Typography>
                                <Typography variant="body2" className="basket-item-info">
                                    👥 Пассажиров: {item.passengers} | 🧳 Багаж:{" "}
                                    {item.baggage === "full" ? "С багажом" : "Ручная кладь"}
                                </Typography>
                                <Typography variant="body2" className="basket-item-time">
                                    🕐 Вылет: {new Date(item.departure_at).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" className="basket-item-user">
                                    👤 Забронировано: {item.booked_by || "Неизвестно"}
                                </Typography>
                            </div>
                            <div className="basket-actions">
                                <Typography variant="h6" className="basket-price">
                                    {item.total_price} €
                                </Typography>
                                <IconButton 
                                    onClick={() => handleDelete(item.id)}
                                    sx={{
                                        color: 'var(--error-color)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(`/booked/${item.id}`)}
                                    sx={{
                                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: 'var(--shadow-lg)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    📋 Подробнее
                                </Button>
                            </div>
                        </div>
                    </Paper>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography 
                    variant="h5" 
                    align="right"
                    sx={{
                        background: 'linear-gradient(135deg, var(--success-color) 0%, #45a049 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        mb: 3
                    }}
                >
                    💰 Общая сумма: {totalSum} €
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ 
                        mt: 2,
                        background: 'linear-gradient(135deg, var(--success-color) 0%, #45a049 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 'var(--font-size-lg)',
                        py: 2,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #45a049 0%, var(--success-color) 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: 'var(--shadow-lg)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                    onClick={() => alert("💳 Оплата ещё не реализована")}
                >
                    💳 Перейти к оплате
                </Button>
            </div>
        </>
    );

}

export default Basket;
