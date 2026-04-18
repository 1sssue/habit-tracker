import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTrash, FaPlus, FaMoon, FaSun, FaMagic } from "react-icons/fa";
import StatChart from "../components/StatChart";
import { keyframes } from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  padding: 20px 16px 60px 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 40px 24px 80px 24px;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderBar = styled.header`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Greeting = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  
  span { color: #6a11cb; }

  @media (min-width: 600px) {
    font-size: 2.2rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconButton = styled.button`
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0; /* Ніколи не сплющується */
  
  &:hover { background: ${(props) => props.theme.border}; transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

const OutlineButton = styled.button`
  background: transparent;
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.5);
  padding: 0 20px;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { background: rgba(255, 107, 107, 0.1); border-color: #ff6b6b; }
`;

const AICard = styled.div`
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.05) 0%, rgba(37, 117, 252, 0.05) 100%);
  border: 1px solid rgba(106, 17, 203, 0.2);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AITrigger = styled.button`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  height: 52px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(106, 17, 203, 0.25);
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(106, 17, 203, 0.35); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: wait; }
`;

const AIResponse = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: ${(props) => props.theme.text};
  padding: 16px;
  background: ${(props) => props.theme.cardBg};
  border-radius: 12px;
  border-left: 4px solid #6a11cb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const AddHabitForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${(props) => props.theme.cardBg};
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border: 1px solid ${(props) => props.theme.border};
  
  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

const CustomInput = styled.input`
  flex: 1;
  height: 52px;
  padding: 0 16px;
  border-radius: 14px;
  border: 2px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  transition: border-color 0.2s;
  
  &:focus { border-color: #1dd1a1; }
  &::placeholder { color: ${(props) => props.theme.textSec}; }
`;

const PrimaryButton = styled.button`
  background: #1dd1a1;
  color: white;
  border: none;
  height: 52px;
  padding: 0 24px;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  &:hover { background: #10ac84; transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

const HabitsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HabitItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: ${(props) => props.theme.cardBg};
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border: 1px solid ${(props) => props.theme.border};
  transition: all 0.2s ease;
  
  &:hover { border-color: #1dd1a1; box-shadow: 0 6px 16px rgba(29, 209, 161, 0.1); }
`;

const HabitContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  
  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  p {
    margin: 4px 0 0 0;
    font-size: 0.9rem;
    color: ${(props) => props.theme.textSec};
  }
`;

const HabitControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const CheckCircle = styled.button`
  width: 48px;
  height: 48px;

  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: ${(props) => props.$done ? 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' : 'transparent'};
  border: 3px solid ${(props) => props.$done ? 'transparent' : props.theme.border};
  color: white;
  cursor: pointer;
  font-size: 1.4rem;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  animation: ${(props) => props.$done ? popAnimation : 'none'} 0.4s ease forwards;

  &:hover {
    border-color: #1dd1a1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(29, 209, 161, 0.2);
  }

  svg {
    opacity: ${(props) => props.$done ? 1 : 0};
    transform: scale(${(props) => props.$done ? 1 : 0});
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const DeleteIcon = styled.button`
  background: transparent;
  color: ${(props) => props.theme.textSec};
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover { color: #ff6b6b; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${(props) => props.theme.textSec};
  background: ${(props) => props.theme.cardBg};
  border-radius: 20px;
  border: 1px dashed ${(props) => props.theme.border};
`;

const popAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
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
    }
    setIsAiLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
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
    <PageWrapper>
      <MainContainer>
        
        <HeaderBar>
          <Greeting>Привіт, <span>{user?.username}</span> 👋</Greeting>
          <HeaderActions>
            <IconButton onClick={toggleTheme} title="Змінити тему">
              {currentTheme === 'light' ? <FaMoon /> : <FaSun />}
            </IconButton>
            <OutlineButton onClick={logout}>Вийти</OutlineButton>
          </HeaderActions>
        </HeaderBar>

        <AICard>
          <AITrigger onClick={getAIAdvice} disabled={isAiLoading}>
            <FaMagic /> {isAiLoading ? "Аналізую твої звички..." : "ШІ Асистент"}
          </AITrigger>
          {aiAdvice && <AIResponse>✨ {aiAdvice}</AIResponse>}
        </AICard>

        <AddHabitForm onSubmit={handleAdd}>
          <CustomInput 
            placeholder="Наприклад: Читати 20 сторінок..." 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <PrimaryButton type="submit"><FaPlus /> Додати</PrimaryButton>
        </AddHabitForm>

        <HabitsGrid>
          {habits.map((habit) => (
            <HabitItem key={habit._id}>
              <HabitContent>
                <h3>{habit.title}</h3>
                <p>🔥 Серія: {habit.completedDates.length} днів</p>
              </HabitContent>
              <HabitControls>
                <CheckCircle 
                  $done={isDoneToday(habit)} 
                  onClick={() => handleToggle(habit._id)}
                >
                  <FaCheck />
                </CheckCircle>
                <DeleteIcon onClick={() => handleDelete(habit._id)}>
                  <FaTrash />
                </DeleteIcon>
              </HabitControls>
            </HabitItem>
          ))}
          
          {habits.length === 0 && (
            <EmptyState>
              <p>У тебе ще немає звичок. Час створити першу! 🚀</p>
            </EmptyState>
          )}
        </HabitsGrid>

        {habits.length > 0 && (
          <div style={{ background: 'var(--card-bg, transparent)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color, transparent)' }}>
            <StatChart habits={habits} currentTheme={currentTheme} />
          </div>
        )}

      </MainContainer>
    </PageWrapper>
  );
};

export default Home;