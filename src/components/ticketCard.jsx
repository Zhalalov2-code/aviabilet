import {
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";

const FlightCard = ({ ticket }) => {
  const {
    origin_city,
    destination_city,
    origin_airport,
    destination_airport,
    departure_at,
    airline,
    price,
    currency,
    link,
  } = ticket;

  const time = new Date(departure_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = new Date(departure_at).toLocaleDateString();

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 2,
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Typography variant="h6">
        {origin_city} ({origin_airport}) → {destination_city} ({destination_airport})
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Вылет: {date} в {time}
      </Typography>

      <Typography variant="body2">Авиакомпания: {airline}</Typography>

      <Divider />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
            {price} {currency}
        </Typography>
        <Button variant="outlined" href={link}>
          Подробнее
        </Button>
      </Stack>
    </Paper>
  );
};

export default FlightCard;
