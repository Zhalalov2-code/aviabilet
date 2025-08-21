import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/index.css';
import SpecialOfferCard from '../components/special-offers';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { CircularProgress } from '@mui/material';
import { getUserCity } from "../utils/getCurrentCity";

function Home() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [cities, setCities] = useState([
    { label: "Amsterdam", code: "AMS" },
    { label: "Dubai", code: "DXB" },
    { label: "Istanbul", code: "IST" },
    { label: "Moscow", code: "SVO" },
    { label: "Paris", code: "CDG" },
    { label: "New York", code: "JFK" },
  ]);

  const navigate = useNavigate();

  const fetchSpecialOffers = useCallback(async () => {
    try {
      const response = await axios.get('https://6873df93c75558e27355818e.mockapi.io/special_offers');
      setSpecialOffers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки спецпредложений:", error);
      // Устанавливаем пустой массив в случае ошибки
      setSpecialOffers([]);
    }
  }, []);

  const detectCity = useCallback(async () => {
    try {
      const city = await getUserCity();
      if (city) {
        setFrom(city);

        setCities(prev => {
          const updated = [...prev, { label: city, code: city.slice(0, 3).toUpperCase() }];
          const unique = updated.filter(
            (obj, index, self) =>
              index === self.findIndex(
                (o) => o.label.toLowerCase() === obj.label.toLowerCase()
              )
          );
          return unique;
        });
      }
    } catch (err) {
      console.error("Ошибка определения города:", err);
      // Не устанавливаем город по умолчанию, оставляем поле пустым
    }
  }, []);

  useEffect(() => {
    fetchSpecialOffers();
    detectCity();
  }, [fetchSpecialOffers, detectCity]);

  const handleSearch = () => {
    if (!from || !to) {
      alert("Пожалуйста, заполните поля Откуда и Куда ");
      return;
    }

    const params = new URLSearchParams({
      from,
      to,
      date: startDate?.toISOString().split("T")[0] || "",
      return: endDate?.toISOString().split("T")[0] || ""
    });

    navigate(`/booking?${params.toString()}`);
  };

  const sliderSettings = {
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center hero-content">
              <div className="hero-badge">
                ✈️ Лучшие цены на авиабилеты
              </div>
              <h1 className="hero-title">
                Удобный поиск дешёвых <br />
                <span className="gradient-text">авиабилетов</span>
              </h1>
              <p className="hero-subtitle">
                Найдите идеальные билеты по лучшим ценам и отправьтесь в незабываемое путешествие
              </p>
            </div>

            <div className="col-12">
              <div className="search-form-container">
                <div className="search-form">
                  <div className="form-header">
                    <h3>🔍 Поиск авиабилетов</h3>
                    <p>Заполните форму ниже для поиска лучших предложений</p>
                  </div>
                  <div className="form-fields">
                    <div className="field-group">
                      <label className="field-label">🛫 Откуда</label>
                      <Autocomplete
                        options={cities}
                        getOptionLabel={(option) => option.label}
                        value={cities.find(city => city.label === from) || null}
                        onChange={(e, value) => setFrom(value ? value.label : "")}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            placeholder="Выберите город отправления"
                            className="search-field"
                          />
                        )}
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">🛬 Куда</label>
                      <Autocomplete
                        options={cities}
                        getOptionLabel={(option) => option.label}
                        value={cities.find(city => city.label === to) || null}
                        onChange={(e, value) => setTo(value ? value.label : "")}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            placeholder="Выберите город назначения"
                            className="search-field"
                          />
                        )}
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">📅 Дата вылета</label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              placeholder="Выберите дату"
                              className="search-field"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>

                    <div className="field-group">
                      <label className="field-label">📅 Дата возвращения</label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              placeholder="Выберите дату (необязательно)"
                              className="search-field"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>

                    <div className="field-group search-button-group">
                      <button className="btn-search" onClick={handleSearch}>
                        🔍 Найти билеты
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Секция специальных предложений */}
      <div className="special-offers-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="section-header">
                <h2 className="section-title">
                  🌟 Специальные предложения
                </h2>
                <p className="section-subtitle">
                  Лучшие цены на популярные направления
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="offers-container">
                {specialOffers.length === 0 ? (
                  <div className="loading-container">
                    <CircularProgress size={60} />
                    <p>Загружаем специальные предложения...</p>
                  </div>
                ) : (
                  <Slider {...sliderSettings}>
                    {specialOffers.map((offer) => (
                      <div
                        key={offer.destination_airport + offer.departure_at}
                        className="offer-slide"
                      >
                        <SpecialOfferCard
                          city={offer.destination_city}
                          country={offer.destination_airport}
                          price={offer.price}
                          imgSrc={offer.image}
                          onDetails={() => {
                            const params = new URLSearchParams({
                              to: offer.destination_city
                            });
                            navigate(`/booking?${params.toString()}`);
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
