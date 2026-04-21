import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

import {
  PageWrapper, ThemeBtn, AuthCard, Title, Form,
  Input, SubmitButton, ErrorText, LinkText
} from "./Register.styles";

const Register = ({ toggleTheme, currentTheme }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 

    if (password !== confirmPassword) {
      return setError("Паролі не збігаються. Спробуйте ще раз 🔍");
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return setError("Пароль має містити мінімум 6 символів: хоча б одну літеру та одну цифру 🔒");
    }

    setIsLoading(true);
    try {
      await axios.post("https://habit-tracker-wtyx.onrender.com/api/auth/register", { username, email, password });
      alert("🎉 Реєстрація успішна! Тепер увійди в акаунт.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Помилка! Можливо, такий email вже існує.");
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
        <Title>Створити <span>Акаунт</span></Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorText>{error}</ErrorText>}
          <Input type="text" placeholder="Ім'я користувача" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input type="password" placeholder="Повторіть пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Створення..." : "Зареєструватися"}
          </SubmitButton>
        </Form>
        <LinkText>Вже є акаунт? <Link to="/login">Увійти</Link></LinkText>
      </AuthCard>
    </PageWrapper>
  );
};

export default Register;