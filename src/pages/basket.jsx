import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Paper, Typography, IconButton, Divider, Stack, CircularProgress, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../utils/authContext";
import { useNavigate } from "react-router-dom";

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
            <div style={{ maxWidth: 800, margin: "50px auto", padding: 20 }}>
                <Typography variant="h5" gutterBottom>
                    Моя корзина
                </Typography>

                {items.map((item) => (
                    <Paper
                        key={item.id}
                        elevation={3}
                        sx={{ p: 2, mb: 2, borderRadius: 2 }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <div>
                                <Typography variant="subtitle1">
                                    Рейс № {item.flight_number} — {item.airline}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.origin_city} → {item.destination_city}
                                </Typography>
                                <Typography variant="body2">
                                    Пассажиров: {item.passengers} | Багаж:{" "}
                                    {item.baggage === "full" ? "С багажом" : "Ручная кладь"}
                                </Typography>
                                <Typography variant="body2">
                                    Вылет: {new Date(item.departure_at).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Забронировано: {item.booked_by || "Неизвестно"}
                                </Typography>
                            </div>
                            <Stack alignItems="flex-end">
                                <Typography variant="h6">{item.total_price} €</Typography>
                                <IconButton onClick={() => handleDelete(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <Button variant="outlined" onClick={() => navigate(`/booked/${item.id}`)}>
                                    Подробнее
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" align="right">
                    Общая сумма: {totalSum} €
                </Typography>

                <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => alert("💳 Оплата ещё не реализована")}
                >
                    Перейти к оплате
                </Button>
            </div>
        </>
    );
}

export default Basket;
