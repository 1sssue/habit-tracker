import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// --- ДИЗАЙН ---
const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a2e;
  padding: 20px;
  font-family: 'Segoe UI', Roboto, sans-serif;
`;

const AuthCard = styled.div`
  background: #252542;
  padding: 40px;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 30px;
  span { color: #1dd1a1; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 16px;
  border-radius: 14px;
  border: 2px solid #3f3f5a;
  background: #1a1a2e;
  color: white;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: #1dd1a1;
    outline: none;
    box-shadow: 0 0 0 3px rgba(29, 209, 161, 0.2);
  }
  &::placeholder { color: #6c6c8e; }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(29, 209, 161, 0.3); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: wait; }
`;

const ErrorText = styled.div`
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const LinkText = styled.p`
  color: #a0a0c0;
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
  a { color: #1dd1a1; text-decoration: none; font-weight: bold; margin-left: 5px; }
  a:hover { text-decoration: underline; }
`;

// --- ЛОГІКА ---
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post("https://habit-tracker-wtyx.onrender.com/api/auth/register", {
        username,
        email,
        password,
      });
      alert("🎉 Реєстрація успішна! Тепер увійди в акаунт.");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
         setError("Помилка 404: Маршрут реєстрації не знайдено на сервері.");
      } else {
         setError(err.response?.data?.message || "Помилка реєстрації! Можливо, такий email вже існує.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AuthCard>
        <Title>Створити <span>Акаунт</span></Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorText>{error}</ErrorText>}
          <Input 
            type="text" 
            placeholder="Ім'я користувача" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            type="password" 
            placeholder="Пароль" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Створення..." : "Зареєструватися"}
          </SubmitButton>
        </Form>
        <LinkText>
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </LinkText>
      </AuthCard>
    </PageWrapper>
  );
};

export default Register;