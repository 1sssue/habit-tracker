import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

import {
  PageWrapper, ThemeBtn, AuthCard, Title, Form,
  Input, SubmitButton, ErrorText, LinkText, ForgotLink
} from "./Login.styles";

const Login = ({ toggleTheme, currentTheme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 
    setIsLoading(true);
    
    try {
      const res = await axios.post("https://habit-tracker-wtyx.onrender.com/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data)); 
      window.location.href = "/";
    } catch (err) {
      if (err.response?.status === 404) setError("Помилка 404: Маршрут не знайдено.");
      else setError(err.response?.data?.message || "Невірний email або пароль 😔");
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <PageWrapper>
      <ThemeBtn onClick={toggleTheme}>
        {currentTheme === 'light' ? <FaMoon /> : <FaSun />}
      </ThemeBtn>
      <AuthCard>
        <Title>Вхід у <span>Tracker</span></Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorText>{error}</ErrorText>}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <ForgotLink to="/forgot-password">Забули пароль?</ForgotLink>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Завантаження..." : "Увійти"}
          </SubmitButton>
        </Form>
        <LinkText>Немає акаунту? <Link to="/register">Зареєструватися</Link></LinkText>
      </AuthCard>
    </PageWrapper>
  );
};

export default Login;