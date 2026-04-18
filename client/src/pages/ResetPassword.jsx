import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

const PageWrapper = styled.div` min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background-color: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; padding: 20px; transition: all 0.3s ease; position: relative; `;
const ThemeBtn = styled.button` position: absolute; top: 20px; right: 20px; background: ${(props) => props.theme.cardBg}; color: ${(props) => props.theme.text}; border: 1px solid ${(props) => props.theme.border}; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: all 0.2s ease; &:hover { transform: translateY(-2px); border-color: #1dd1a1; } `;
const AuthCard = styled.div` background: ${(props) => props.theme.cardBg}; padding: 40px; border-radius: 24px; width: 100%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid ${(props) => props.theme.border}; transition: all 0.3s ease; `;
const Title = styled.h2` text-align: center; font-size: 1.8rem; margin-top: 0; margin-bottom: 30px; span { color: #1dd1a1; } `;
const Form = styled.form` display: flex; flex-direction: column; gap: 20px; `;
const Input = styled.input` padding: 16px; border-radius: 14px; border: 2px solid ${(props) => props.theme.border}; background: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; font-size: 1.1rem; transition: all 0.2s ease; &:focus { border-color: #1dd1a1; box-shadow: 0 0 0 3px rgba(29, 209, 161, 0.2); } &::placeholder { color: ${(props) => props.theme.textSec}; } `;
const SubmitButton = styled.button` background: linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%); color: white; border: none; padding: 16px; border-radius: 14px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.2s ease; &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(29, 209, 161, 0.3); } &:disabled { opacity: 0.7; cursor: wait; } `;
const MessageText = styled.div` background: rgba(255, 107, 107, 0.1); color: #ff6b6b; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid rgba(255, 107, 107, 0.3); margin-bottom: 20px; font-weight: 500; `;

const ResetPassword = ({ toggleTheme, currentTheme }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // НОВИЙ СТЕЙТ
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); 

    if (password !== confirmPassword) {
      return setError("Паролі не збігаються 🔍");
    }

    setIsLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${id}/${token}`, { password });
      alert("🎉 Пароль успішно змінено! Тепер ти можеш увійти з новим паролем.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Посилання недійсне або помилка сервера.");
    } finally { setIsLoading(false); }
  };

  return (
    <PageWrapper>
      <ThemeBtn onClick={toggleTheme}>{currentTheme === 'light' ? <FaMoon /> : <FaSun />}</ThemeBtn>
      <AuthCard>
        <Title>Новий <span>Пароль</span></Title>
        {error && <MessageText>{error}</MessageText>}
        <Form onSubmit={handleSubmit}>
          <Input type="password" placeholder="Придумай новий пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {/* НОВЕ ПОЛЕ */}
          <Input type="password" placeholder="Повторіть новий пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          
          <SubmitButton type="submit" disabled={isLoading}>{isLoading ? "Збереження..." : "Зберегти пароль"}</SubmitButton>
        </Form>
      </AuthCard>
    </PageWrapper>
  );
};

export default ResetPassword;