import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import '../css/index.css';
import Reklama from '../img/reklama.png';
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
import Footer from "../components/footer";
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
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12 text-center p-5">
            <h1>Удобный поиск дешёвых <br /> авиабилетов</h1>
          </div>

          <div className="col-12">
            <div className="form-control" style={{ marginBottom: "40px" }}>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.label}
                value={cities.find(city => city.label === from) || null}
                onChange={(e, value) => setFrom(value ? value.label : "")}
                renderInput={(params) => (
                  <TextField {...params} label="Откуда" fullWidth />
                )}
              />

              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.label}
                value={cities.find(city => city.label === to) || null}
                onChange={(e, value) => setTo(value ? value.label : "")}
                renderInput={(params) => (
                  <TextField {...params} label="Куда" fullWidth />
                )}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Туда"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Обратно"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>

              <button className="btn-search" onClick={handleSearch}>
                Найти билет
              </button>
            </div>
          </div>

          <div className="col-12 text-center mt-5">
            <img width={800} src={Reklama} alt="Реклама" />
          </div>

          <div className="col-12 text-center mt-5">
            <h1>Специальные предложения</h1>
          </div>

          <div className="col-12 px-5 mt-2 mb-5">
            {specialOffers.length === 0 ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
              }}>
                <CircularProgress />
              </div>
            ) : (
              <Slider {...sliderSettings}>
                {specialOffers.map((offer) => (
                  <div
                    key={offer.destination_airport + offer.departure_at}
                    className="p-2"
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
      <Footer />
    </div>
  );
}

export default Home;
