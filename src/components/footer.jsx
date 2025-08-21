import { Box, Container, Typography, Link, Grid, Divider } from "@mui/material";
import Air from '../img/air-express.png'
import '../css/footer.css'

function Footer() {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={2} className="footer-content">
          {/* Логотип и описание */}
          <Grid item xs={12} md={4} className="footer-brand">
            <Box className="brand-section">
              <img src={Air} alt="Air Express" className="footer-logo" />
              <Typography variant="body1" className="brand-description">
                Ваш надежный партнер в мире авиапутешествий. Мы предлагаем лучшие цены на авиабилеты и профессиональный сервис.
              </Typography>
            </Box>
          </Grid>

          {/* Поддержка */}
          <Grid item xs={12} md={3} className="footer-section">
            <Typography variant="h6" className="section-title">
              🆘 Поддержка
            </Typography>
            <Box className="footer-links">
              <Link className="footer-link">❓ Помощь</Link>
              <Link className="footer-link">📞 Контакты</Link>
              <Link className="footer-link">❔ FAQ</Link>
              <Link className="footer-link">💬 Обратная связь</Link>
            </Box>
          </Grid>

          {/* Информация */}
          <Grid item xs={12} md={3} className="footer-section">
            <Typography variant="h6" className="section-title">
              ℹ️ Информация
            </Typography>
            <Box className="footer-links">
              <Link className="footer-link">📋 О нас</Link>
              <Link className="footer-link">📄 Условия использования</Link>
              <Link className="footer-link">🔒 Политика конфиденциальности</Link>
              <Link className="footer-link">🤝 Партнеры</Link>
            </Box>
          </Grid>

          {/* Быстрые ссылки */}
          <Grid item xs={12} md={2} className="footer-section">
            <Typography variant="h6" className="section-title">
              🚀 Быстрые ссылки
            </Typography>
            <Box className="footer-links">
              <Link href="/" className="footer-link">🏠 Главная</Link>
              <Link href="/booking" className="footer-link">✈️ Авиабилеты</Link>
              <Link href="/basket" className="footer-link">🛒 Корзина</Link>
              <Link href="/profile" className="footer-link">👤 Профиль</Link>
            </Box>
          </Grid>
        </Grid>

        <Divider className="footer-divider" />

        {/* Нижняя часть футера */}
        <Box className="footer-bottom">
          <Typography variant="body2" className="copyright">
            &copy; {new Date().getFullYear()} Air Express. Все права защищены.
          </Typography>
          <Box className="footer-bottom-links">
            <Link className="bottom-link">Условия</Link>
            <Link className="bottom-link">Конфиденциальность</Link>
            <Link className="bottom-link">Cookies</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
