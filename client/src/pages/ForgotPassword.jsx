import { useState } from "react";
import axios from "axios";
import { FaMoon, FaSun, FaArrowLeft } from "react-icons/fa";

import {
  PageWrapper, ThemeBtn, AuthCard, BackBtn, Title,
  Subtitle, Form, Input, SubmitButton, MessageText
} from "./ForgotPassword.styles";

const ForgotPassword = ({ toggleTheme, currentTheme }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 
    setMessage(""); 
    setIsLoading(true);
    
    try {
      const res = await axios.post("https://habit-tracker-wtyx.onrender.com/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Помилка при відправці листа.");
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
        <BackBtn to="/login"><FaArrowLeft /></BackBtn>
        <Title>Відновлення <span>Пароля</span></Title>
        <Subtitle>Введи свій email, і ми надішлемо тобі посилання для скидання пароля.</Subtitle>
        
        {message && <MessageText>{message}</MessageText>}
        {error && <MessageText $error>{error}</MessageText>}

        <Form onSubmit={handleSubmit}>
          <Input type="email" placeholder="Твій Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Відправка..." : "Надіслати посилання"}
          </SubmitButton>
        </Form>
      </AuthCard>
    </PageWrapper>
  );
};

export default ForgotPassword;