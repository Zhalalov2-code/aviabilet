import { Box, Container, Typography, Link } from "@mui/material";
import Air from '../img/air-express.png'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#11263A",
        color: "white",
        py: 4,
        mt: 6,
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h6" gutterBottom>
          <img width={150} src={Air} alt="" />
        </Typography>
        <Typography variant="body2" color="gray">
          &copy; {new Date().getFullYear()} Все права защищены
        </Typography>
        <Box mt={2}>
          <Link href="/" underline="hover" color="inherit" sx={{ mx: 1 }}>
            О нас
          </Link>
          <Link href="/" underline="hover" color="inherit" sx={{ mx: 1 }}>
            Контакты
          </Link>
          <Link href="/" underline="hover" color="inherit" sx={{ mx: 1 }}>
            Условия использования
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
