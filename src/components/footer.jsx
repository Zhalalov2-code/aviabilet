import { Box, Container, Typography, Link } from "@mui/material";
import Air from '../img/air-express.png'
import '../css/footer.css'

function Footer() {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="md">
        <Typography variant="h6" gutterBottom>
          <img src={Air} alt="Air Express" />
        </Typography>
        <Typography variant="body2" color="gray">
          &copy; {new Date().getFullYear()} Все права защищены
        </Typography>
        <Box className="links">
          <Link href="/">О нас</Link>
          <Link href="/">Контакты</Link>
          <Link href="/">Условия использования</Link>
        </Box>
      </Container>
    </Box>

  );
}

export default Footer;
