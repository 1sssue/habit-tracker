import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Form = styled.form`
  background: white;
  padding: 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 300px;
`;

const Input = styled.input`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #764ba2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover { background-color: #5a367e; }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://habit-tracker-wtyx.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data)); 
      
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Невірний логін або пароль!");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Вхід</Title>
        <Input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Пароль" type="password" onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit">Увійти</Button>
        <p style={{textAlign: 'center'}}>
           Немає акаунту? <Link to="/register">Зареєструватись</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;