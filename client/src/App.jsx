import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const user = localStorage.getItem("user");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Зберігаємо вибір у браузері
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home toggleTheme={toggleTheme} currentTheme={theme} /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;