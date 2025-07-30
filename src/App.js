import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import Booking from "./pages/booking";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from './pages/profile';
import { AuthProvider } from "./utils/authContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
