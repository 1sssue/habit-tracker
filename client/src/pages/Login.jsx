import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

const PageWrapper = styled.div` min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background-color: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; padding: 20px; transition: all 0.3s ease; position: relative; `;
const ThemeBtn = styled.button` position: absolute; top: 20px; right: 20px; background: ${(props) => props.theme.cardBg}; color: ${(props) => props.theme.text}; border: 1px solid ${(props) => props.theme.border}; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: all 0.2s ease; &:hover { transform: translateY(-2px); border-color: #6a11cb; } `;
const AuthCard = styled.div` background: ${(props) => props.theme.cardBg}; padding: 40px; border-radius: 24px; width: 100%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid ${(props) => props.theme.border}; transition: all 0.3s ease; `;
const Title = styled.h2` text-align: center; font-size: 2rem; margin-top: 0; margin-bottom: 30px; span { color: #6a11cb; } `;
const Form = styled.form` display: flex; flex-direction: column; gap: 20px; `;
const Input = styled.input` padding: 16px; border-radius: 14px; border: 2px solid ${(props) => props.theme.border}; background: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; font-size: 1.1rem; transition: all 0.2s ease; &:focus { border-color: #6a11cb; box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.2); } &::placeholder { color: ${(props) => props.theme.textSec}; } `;
const SubmitButton = styled.button` background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; border: none; padding: 16px; border-radius: 14px; font-size: 1.2rem; font-weight: bold; cursor: pointer; margin-top: 5px; transition: all 0.2s ease; &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(106, 17, 203, 0.3); } &:disabled { opacity: 0.7; cursor: wait; } `;
const ErrorText = styled.div` background: rgba(255, 107, 107, 0.1); color: #ff6b6b; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid rgba(255, 107, 107, 0.3); `;
const LinkText = styled.p` color: ${(props) => props.theme.textSec}; text-align: center; margin-top: 25px; a { color: #2575fc; text-decoration: none; font-weight: bold; margin-left: 5px; } a:hover { text-decoration: underline; } `;

const ForgotLink = styled(Link)`
  color: ${(props) => props.theme.textSec};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: right;
  margin-top: -10px; /* Підтягуємо ближче до інпута */
  transition: color 0.2s;
  &:hover { color: #6a11cb; }
`;

const Login = ({ toggleTheme, currentTheme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data)); 
      window.location.href = "/";
    } catch (err) {
      if (err.response?.status === 404) setError("Помилка 404: Маршрут не знайдено.");
      else setError(err.response?.data?.message || "Невірний email або пароль 😔");
    } finally { setIsLoading(false); }
  };

  return (
    <PageWrapper>
      <ThemeBtn onClick={toggleTheme}>{currentTheme === 'light' ? <FaMoon /> : <FaSun />}</ThemeBtn>
      <AuthCard>
        <Title>Вхід у <span>Habit Tracker</span></Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorText>{error}</ErrorText>}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          {/* ГАРНЕ ПОСИЛАННЯ */}
          <ForgotLink to="/forgot-password">Забули пароль?</ForgotLink>
          
          <SubmitButton type="submit" disabled={isLoading}>{isLoading ? "Завантаження..." : "Увійти"}</SubmitButton>
        </Form>
        <LinkText>Немає акаунту? <Link to="/register">Зареєструватися</Link></LinkText>
      </AuthCard>
    </PageWrapper>
  );
};

export default Login;