import "./App.css";

import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import About from "./pages/public/About";
import Home from "./pages/public/Home";

function App() {
	return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
