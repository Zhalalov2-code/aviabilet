import { useEffect, useState, useCallback } from "react";
import { FormControl, InputLabel, MenuItem, Select, CircularProgress, TextField, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FlightCard from "../components/ticketCard";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../css/booking.css'

let debounceTimeout;

function SearchResults() {
  const [tickets, setTickets] = useState([]);
  const [sortedTickets, setSortedTickets] = useState([]);
  const [sort, setSort] = useState("default");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [fromInput, setFromInput] = useState(searchParams.get("from") || "");
  const [toInput, setToInput] = useState(searchParams.get("to") || "");
  const [dateInput, setDateInput] = useState(null);

  const fetchTickets = useCallback(() => {
    setLoading(true);
    axios
      .get("https://6873df93c75558e27355818e.mockapi.io/tickets")
      .then((res) => {
        let filtered = res.data;

        if (fromInput) {
          filtered = filtered.filter((ticket) =>
            ticket.origin_city.toLowerCase().includes(fromInput.toLowerCase().trim())
          );
        }

        if (toInput) {
          filtered = filtered.filter((ticket) =>
            ticket.destination_city.toLowerCase().includes(toInput.toLowerCase().trim())
          );
        }

        if (dateInput) {
          const selectedDate = dateInput.toISOString().split("T")[0];
          filtered = filtered.filter(
            (ticket) => ticket.departure_at.split("T")[0] === selectedDate
          );
        }

        setTickets(filtered);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке билетов:", error);
        setTickets([]);
      })
      .finally(() => setLoading(false));
  }, [fromInput, toInput, dateInput]);

  useEffect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [fetchTickets]);

  useEffect(() => {
    let filtered = [...tickets];

    if (airlineFilter) {
      filtered = filtered.filter((ticket) => ticket.airline === airlineFilter);
    }

    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setSortedTickets(filtered);
  }, [tickets, sort, airlineFilter]);

  const uniqueAirlines = [...new Set(tickets.map((t) => t.airline))];

  return (
    <div className="page-container">

      <div className="content-wrap">
        <h2 className="page-title">
          {fromInput || toInput || dateInput ? (
            <>
              ✈️ Результаты поиска: {fromInput && `с ${fromInput}`} {toInput && `на ${toInput}`} {dateInput && `(туда: ${dateInput.toLocaleDateString("ru-RU")})`}
            </>
          ) : (
            "✈️ Все доступные авиабилеты"
          )}
        </h2>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className="search-grid"
        >
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              label="Откуда"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              label="Куда"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата"
                value={dateInput}
                onChange={(newValue) => setDateInput(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={sort}
                label="Сортировка"
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="default">По умолчанию</MenuItem>
                <MenuItem value="price_asc">Сначала дешёвые</MenuItem>
                <MenuItem value="price_desc">Сначала дорогие</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Авиакомпания</InputLabel>
              <Select
                value={airlineFilter}
                label="Авиакомпания"
                onChange={(e) => setAirlineFilter(e.target.value)}
              >
                <MenuItem value="">Все</MenuItem>
                {uniqueAirlines.map((airline) => (
                  <MenuItem key={airline} value={airline}>
                    {airline}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <div className="loading-spinner">
            <CircularProgress size={60} />
          </div>
        ) : (
          <>
            {sortedTickets.length > 0 ? (
              sortedTickets.map((ticket) => (
                <FlightCard
                  key={ticket.flight_number + ticket.departure_at}
                  ticket={ticket}
                />
              ))
            ) : (
              <div className="no-results">
                <p>
                  Билеты не найдены. Попробуйте изменить параметры поиска.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
