import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaMoon, FaSun, FaArrowLeft } from "react-icons/fa";

const PageWrapper = styled.div` min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background-color: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; padding: 20px; transition: all 0.3s ease; position: relative; `;
const ThemeBtn = styled.button` position: absolute; top: 20px; right: 20px; background: ${(props) => props.theme.cardBg}; color: ${(props) => props.theme.text}; border: 1px solid ${(props) => props.theme.border}; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: all 0.2s ease; &:hover { transform: translateY(-2px); border-color: #6a11cb; } `;
const AuthCard = styled.div` background: ${(props) => props.theme.cardBg}; padding: 40px; border-radius: 24px; width: 100%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid ${(props) => props.theme.border}; transition: all 0.3s ease; position: relative; `;
const BackBtn = styled(Link)` position: absolute; top: 20px; left: 20px; color: ${(props) => props.theme.textSec}; font-size: 1.2rem; transition: 0.2s; &:hover { color: #6a11cb; transform: translateX(-3px); } `;
const Title = styled.h2` text-align: center; font-size: 1.8rem; margin-top: 10px; margin-bottom: 20px; span { color: #6a11cb; } `;
const Subtitle = styled.p` text-align: center; color: ${(props) => props.theme.textSec}; margin-bottom: 30px; font-size: 0.95rem; line-height: 1.5; `;
const Form = styled.form` display: flex; flex-direction: column; gap: 20px; `;
const Input = styled.input` padding: 16px; border-radius: 14px; border: 2px solid ${(props) => props.theme.border}; background: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; font-size: 1.1rem; transition: all 0.2s ease; &:focus { border-color: #6a11cb; box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.2); } &::placeholder { color: ${(props) => props.theme.textSec}; } `;
const SubmitButton = styled.button` background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; border: none; padding: 16px; border-radius: 14px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.2s ease; &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(106, 17, 203, 0.3); } &:disabled { opacity: 0.7; cursor: wait; } `;
const MessageText = styled.div` background: ${(props) => props.$error ? 'rgba(255, 107, 107, 0.1)' : 'rgba(29, 209, 161, 0.1)'}; color: ${(props) => props.$error ? '#ff6b6b' : '#1dd1a1'}; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid ${(props) => props.$error ? 'rgba(255, 107, 107, 0.3)' : 'rgba(29, 209, 161, 0.3)'}; margin-bottom: 20px; font-weight: 500; `;

const ForgotPassword = ({ toggleTheme, currentTheme }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setMessage(""); setIsLoading(true);
    try {
      const res = await axios.post("https://habit-tracker-wtyx.onrender.com/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Помилка при відправці листа.");
    } finally { setIsLoading(false); }
  };

  return (
    <PageWrapper>
      <ThemeBtn onClick={toggleTheme}>{currentTheme === 'light' ? <FaMoon /> : <FaSun />}</ThemeBtn>
      <AuthCard>
        <BackBtn to="/login"><FaArrowLeft /></BackBtn>
        <Title>Відновлення <span>Пароля</span></Title>
        <Subtitle>Введи свій email, і ми надішлемо тобі посилання для скидання пароля.</Subtitle>
        
        {message && <MessageText>{message}</MessageText>}
        {error && <MessageText $error>{error}</MessageText>}

        <Form onSubmit={handleSubmit}>
          <Input type="email" placeholder="Твій Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <SubmitButton type="submit" disabled={isLoading}>{isLoading ? "Відправка..." : "Надіслати посилання"}</SubmitButton>
        </Form>
      </AuthCard>
    </PageWrapper>
  );
};

export default ForgotPassword;