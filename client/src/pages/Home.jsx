import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTrash, FaPlus, FaMoon, FaSun, FaStar } from "react-icons/fa";
import StatChart from "../components/StatChart";

const Container = styled.div`
  min-height: 100vh;
  padding: 40px;
  background-color: ${(props) => props.theme.bg}; 
  color: ${(props) => props.theme.text};
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.3s ease; 
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.text};
  transition: color 0.3s ease;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ThemeBtn = styled.button`
  background: transparent;
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  &:hover { background: ${(props) => props.theme.cardBg}; }
`;

const LogoutBtn = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: #ee5253; }
`;

const AIBtn = styled.button`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  justify-content: center;
  transition: transform 0.2s;
  &:hover { transform: scale(1.01); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const AIBox = styled.div`
  background: ${(props) => props.theme.cardBg};
  border-left: 5px solid #6a11cb;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-style: italic;
  color: ${(props) => props.theme.text};
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  background: ${(props) => props.theme.cardBg};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
`;

const AddBtn = styled.button`
  background: #1dd1a1;
  color: white;
  border: none;
  padding: 0 25px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover { background: #10ac84; }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const HabitCard = styled.div`
  background: ${(props) => props.theme.cardBg};
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover { transform: translateY(-2px); }
`;

const HabitInfo = styled.div`
  h3 { margin: 0; color: ${(props) => props.theme.text}; }
  p { margin: 5px 0 0; color: ${(props) => props.theme.textSec}; font-size: 0.9em; }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const CheckBtn = styled.button`
  background: ${(props) => props.$done ? '#1dd1a1' : props.theme.bg};
  color: ${(props) => props.$done ? 'white' : props.theme.textSec};
  border: 1px solid ${(props) => props.theme.border};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover { border-color: #1dd1a1; }
`;

const DeleteBtn = styled.button`
  background: transparent;
  color: #ff6b6b;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  opacity: 0.5;
  &:hover { opacity: 1; }
`;

const Home = ({ toggleTheme, currentTheme }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  
  const [aiAdvice, setAiAdvice] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchHabits = async () => {
    try {
      const config = { headers: { "auth-token": user?.token } };
      const res = await axios.get("https://habit-tracker-wtyx.onrender.com/api/habits", config);
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchHabits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const getAIAdvice = async () => {
    setIsAiLoading(true);
    try {
      const config = { headers: { "auth-token": user?.token } };
      const res = await axios.post("https://habit-tracker-wtyx.onrender.com/api/ai/suggest", { habits }, config);
      setAiAdvice(res.data.advice);
    } catch (err) {
      setAiAdvice("Не вдалося підключитися до помічника 😔");
      console.error(err);
    }
    setIsAiLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newHabit) return;
    try {
      const config = { headers: { "auth-token": user?.token } };
      const res = await axios.post("https://habit-tracker-wtyx.onrender.com/api/habits", { title: newHabit }, config);
      setHabits([...habits, res.data]);
      setNewHabit("");
    } catch (err) {
      alert("Помилка створення!");
    }
  };

  const handleToggle = async (id) => {
    try {
      const config = { headers: { "auth-token": user?.token } };
      await axios.put(`https://habit-tracker-wtyx.onrender.com/api/habits/${id}/toggle`, {}, config);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Видалити цю звичку?")) return;
    try {
      const config = { headers: { "auth-token": user?.token } };
      await axios.delete(`https://habit-tracker-wtyx.onrender.com/api/habits/${id}`, config);
      setHabits(habits.filter(h => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isDoneToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  if (!user) return null;

  return (
    <Container>
      <Header>
        <Title>Привіт, {user?.username} 👋</Title>
        <Controls>
          <ThemeBtn onClick={toggleTheme} title="Змінити тему">
            {currentTheme === 'light' ? <FaMoon /> : <FaSun />}
          </ThemeBtn>
          <LogoutBtn onClick={logout}>Вийти</LogoutBtn>
        </Controls>
      </Header>

      <AIBtn onClick={getAIAdvice} disabled={isAiLoading}>
        <FaStar /> {isAiLoading ? "ШІ думає..." : "Отримати пораду від ШІ"}
      </AIBtn>

      {aiAdvice && (
        <AIBox>
          ✨ <b>ШІ-помічник каже:</b> <br/> {aiAdvice}
        </AIBox>
      )}

      <Form onSubmit={handleAdd}>
        <Input 
          placeholder="Яку нову звичку хочеш розвинути?" 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <AddBtn type="submit"><FaPlus /> Додати</AddBtn>
      </Form>

      <List>
        {habits.map((habit) => (
          <HabitCard key={habit._id}>
            <HabitInfo>
              <h3>{habit.title}</h3>
              <p>🔥 Серія: {habit.completedDates.length} днів</p>
            </HabitInfo>
            <Actions>
              <CheckBtn 
                $done={isDoneToday(habit)} 
                onClick={() => handleToggle(habit._id)}
              >
                <FaCheck />
              </CheckBtn>
              <DeleteBtn onClick={() => handleDelete(habit._id)}>
                <FaTrash />
              </DeleteBtn>
            </Actions>
          </HabitCard>
        ))}
        {habits.length === 0 && <p style={{textAlign:'center', color:'#888'}}>Поки що немає звичок. Створи першу!</p>}
      </List>

      {habits.length > 0 && <StatChart habits={habits} />}
      
    </Container>
  );
};

export default Home;