import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

import {
  PageWrapper, ThemeBtn, AuthCard, Title, Form,
  Input, SubmitButton, MessageText
} from "./ResetPassword.styles";

const ResetPassword = ({ toggleTheme, currentTheme }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 

    if (password !== confirmPassword) {
      return setError("Паролі не збігаються 🔍");
    }

    setIsLoading(true);
    try {
      await axios.post(`https://habit-tracker-wtyx.onrender.com/api/auth/reset-password/${id}/${token}`, { password });
      alert("🎉 Пароль успішно змінено! Тепер ти можеш увійти з новим паролем.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Посилання недійсне або помилка сервера.");
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
        <Title>Новий <span>Пароль</span></Title>
        {error && <MessageText>{error}</MessageText>}
        <Form onSubmit={handleSubmit}>
          <Input type="password" placeholder="Придумай новий пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input type="password" placeholder="Повторіть новий пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Збереження..." : "Зберегти пароль"}
          </SubmitButton>
        </Form>
      </AuthCard>
    </PageWrapper>
  );
};

export default ResetPassword;