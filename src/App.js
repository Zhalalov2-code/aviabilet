import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import Booking from "./pages/booking";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from './pages/profile';
import { AuthProvider } from "./utils/authContext";
import FlightDetails from "./pages/ticketsDetails";
import Basket from './pages/basket';
import BookedFlightDetails from "./pages/bookedTicketsDetails";
import Layout from './components/layout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/flight/:id" element={<FlightDetails />} />
            <Route path="/basket" element={<Basket />} />
            <Route path="/booked/:id" element={<BookedFlightDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
