import { Paper, Typography, Stack, Button, Divider } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ ticket }) => {
  const {
    id,
    origin_city,
    destination_city,
    origin_airport,
    destination_airport,
    departure_at,
    airline,
    price,
    currency,
  } = ticket;

  const navigate = useNavigate();

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
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        mb: 3,
        maxWidth: 900,
        mx: "auto",
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)',
          transition: 'width 0.3s ease'
        },
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          borderColor: 'var(--secondary-color)',
          '&::before': {
            width: '8px'
          }
        }
      }}
    >
      <Typography 
        variant="h5" 
        sx={{
          fontWeight: 700,
          color: 'var(--primary-color)',
          mb: 1
        }}
      >
        ✈️ {origin_city} ({origin_airport}) → {destination_city} ({destination_airport})
      </Typography>

      <Typography 
        variant="body1" 
        sx={{
          color: 'var(--gray-600)',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        🕐 Вылет: {date} в {time}
      </Typography>

      <Typography 
        variant="body1" 
        sx={{
          color: 'var(--gray-700)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        🏢 Авиакомпания: {airline}
      </Typography>

      <Divider />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography 
          variant="h4" 
          sx={{
            background: 'linear-gradient(135deg, #59ABE8 0%, #4a9bd8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '2rem'
          }}
        >
          💰 {price} {currency}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/flight/${id}`)}
          sx={{
            background: 'linear-gradient(135deg, #11263A 0%, #1a344a 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: 'var(--font-size-base)',
            px: 4,
            py: 1.5,
            borderRadius: 'var(--radius-lg)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1a344a 0%, #11263A 100%)',
              transform: 'translateY(-2px)',
              boxShadow: 'var(--shadow-lg)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          📋 Подробнее
        </Button>
      </Stack>
    </Paper>
  );
};

export default FlightCard;
