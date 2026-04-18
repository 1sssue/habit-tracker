import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaCheck, FaTrash, FaPlus, FaMoon, FaSun, FaMagic, FaEdit, FaSave, FaTimes, FaSortAmountDown, FaClock } from "react-icons/fa";
import StatChart from "../components/StatChart";

const PageWrapper = styled.div` min-height: 100vh; width: 100%; background-color: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; display: flex; justify-content: center; padding: 15px 12px 60px 12px; transition: background-color 0.3s ease, color 0.3s ease; @media (min-width: 768px) { padding: 40px 24px 80px 24px; } `;
const MainContainer = styled.div` width: 100%; max-width: 768px; display: flex; flex-direction: column; gap: 20px; `;

const HeaderBar = styled.header` display: flex; justify-content: space-between; align-items: center; `;
const Greeting = styled.h1` font-size: 1.5rem; font-weight: 800; line-height: 1.2; margin: 0; span { color: #1dd1a1; } @media (min-width: 600px) { font-size: 2.2rem; } `;
const HeaderActions = styled.div` display: flex; gap: 8px; align-items: center; `;

const IconButton = styled.button` background: ${(props) => props.theme.cardBg}; color: ${(props) => props.theme.text}; border: 1px solid ${(props) => props.theme.border}; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; &:hover { background: ${(props) => props.theme.border}; transform: translateY(-2px); } `;
const OutlineButton = styled.button` background: transparent; color: #ff6b6b; border: 1px solid rgba(255, 107, 107, 0.5); padding: 0 16px; height: 44px; border-radius: 12px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; &:hover { background: rgba(255, 107, 107, 0.1); border-color: #ff6b6b; } `;

const AICard = styled.div` background: linear-gradient(135deg, rgba(106, 17, 203, 0.05) 0%, rgba(37, 117, 252, 0.05) 100%); border: 1px solid rgba(106, 17, 203, 0.2); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 12px; `;
const AITrigger = styled.button` background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; border: none; height: 48px; border-radius: 14px; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 8px 16px rgba(106, 17, 203, 0.25); transition: all 0.2s; &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(106, 17, 203, 0.35); } &:disabled { opacity: 0.7; cursor: wait; } `;
const AIResponse = styled.div` font-size: 0.95rem; line-height: 1.5; color: ${(props) => props.theme.text}; padding: 16px; background: ${(props) => props.theme.cardBg}; border-radius: 12px; border-left: 4px solid #6a11cb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); `;

const FormCard = styled.form` display: flex; flex-direction: column; background: ${(props) => props.theme.cardBg}; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid ${(props) => props.theme.border}; overflow: hidden; transition: border-color 0.3s; &:focus-within { border-color: #1dd1a1; } `;
const InputsWrapper = styled.div` display: flex; flex-direction: column; gap: 8px; padding: 16px 20px; `;
const CleanInput = styled.input` border: none; background: transparent; color: ${(props) => props.theme.text}; font-size: 1.15rem; font-weight: 600; width: 100%; &::placeholder { color: ${(props) => props.theme.textSec}; opacity: 0.6; font-weight: 500; } &:focus { outline: none; } `;
const CleanTextarea = styled.textarea` border: none; background: transparent; color: ${(props) => props.theme.textSec}; font-family: inherit; font-size: 0.95rem; width: 100%; resize: none; min-height: 40px; overflow-y: hidden; &::placeholder { color: ${(props) => props.theme.textSec}; opacity: 0.5; } &:focus { outline: none; color: ${(props) => props.theme.text}; } `;
const FormActions = styled.div` display: flex; justify-content: flex-end; padding: 10px 16px 16px 16px; `;
const PrimaryButton = styled.button` background: #1dd1a1; color: white; border: none; height: 44px; padding: 0 20px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s; &:hover { background: #10ac84; transform: translateY(-2px); } `;

const ListHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; h2 { margin: 0; font-size: 1.3rem; color: ${(props) => props.theme.text}; } `;
const SortContainer = styled.div` display: flex; align-items: center; gap: 8px; color: ${(props) => props.theme.textSec}; `;
const SortSelect = styled.select` padding: 8px 12px; border-radius: 10px; border: 1px solid ${(props) => props.theme.border}; background: ${(props) => props.theme.cardBg}; color: ${(props) => props.theme.text}; font-weight: 600; cursor: pointer; outline: none; `;

const HabitsGrid = styled.div` display: flex; flex-direction: column; gap: 12px; `;
const HabitItem = styled.div` display: flex; flex-direction: column; gap: 16px; background: ${(props) => props.theme.cardBg}; padding: 16px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); border: 1px solid ${(props) => props.theme.border}; transition: all 0.2s ease; &:hover { border-color: ${(props) => props.$editing ? props.theme.border : '#1dd1a1'}; } @media (min-width: 600px) { flex-direction: row; align-items: ${(props) => props.$editing ? 'flex-start' : 'center'}; justify-content: space-between; padding: 20px; } `;
const HabitContent = styled.div` flex: 1; min-width: 0; h3 { margin: 0; font-size: 1.1rem; font-weight: 600; word-break: break-word; } .desc { margin: 4px 0 0 0; font-size: 0.9rem; color: ${(props) => props.theme.textSec}; line-height: 1.4; } .streak { margin: 10px 0 0 0; font-size: 0.85rem; font-weight: 700; color: #ff9f43; display: flex; align-items: center; gap: 5px; background: rgba(255, 159, 67, 0.1); padding: 4px 10px; border-radius: 8px; width: fit-content; } `;
const HabitControls = styled.div` display: flex; align-items: center; gap: 8px; flex-shrink: 0; align-self: flex-end; width: 100%; justify-content: flex-end; @media (min-width: 600px) { align-self: center; width: auto; } `;
const ActionIconBtn = styled.button` background: ${(props) => props.$bg || 'transparent'}; color: ${(props) => props.$color || props.theme.textSec}; border: none; font-size: 1.1rem; cursor: pointer; padding: 10px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; &:hover { background: ${(props) => props.$hoverBg || 'transparent'}; color: ${(props) => props.$hoverColor || '#fff'}; transform: scale(1.05); } `;

const popAnimation = keyframes` 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } `;
const CheckCircle = styled.button` width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: ${(props) => props.$done ? 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' : 'transparent'}; border: 3px solid ${(props) => props.$done ? 'transparent' : props.theme.border}; color: white; cursor: pointer; font-size: 1.2rem; flex-shrink: 0; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); animation: ${(props) => props.$done ? popAnimation : 'none'} 0.4s ease forwards; margin-left: auto; &:hover { border-color: #1dd1a1; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(29, 209, 161, 0.2); } svg { opacity: ${(props) => props.$done ? 1 : 0}; transform: scale(${(props) => props.$done ? 1 : 0}); transition: all 0.3s ease; } @media (min-width: 600px) { margin-left: 10px; width: 48px; height: 48px; font-size: 1.4rem; } `;
const EmptyState = styled.div` text-align: center; padding: 40px 20px; color: ${(props) => props.theme.textSec}; background: ${(props) => props.theme.cardBg}; border-radius: 20px; border: 1px dashed ${(props) => props.theme.border}; `;

const ChartHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; h3 { margin: 0; font-size: 1.1rem; color: ${(props) => props.theme.text}; } `;
const IntervalSelect = styled.select` padding: 6px 10px; border-radius: 8px; border: 1px solid ${(props) => props.theme.border}; background: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; font-size: 0.85rem; font-weight: 600; cursor: pointer; outline: none; `;

const ReminderWrapper = styled.div` margin-top: 10px; padding-top: 15px; border-top: 1px solid rgba(150, 150, 150, 0.15); `;
const ReminderHeader = styled.div` display: flex; align-items: center; gap: 8px; color: ${(props) => props.theme.textSec}; font-size: 0.9rem; font-weight: 600; margin-bottom: 12px; `;
const TimeChipContainer = styled.div` display: flex; gap: 8px; flex-wrap: wrap; align-items: center; `;

const TimeChip = styled.button`
  background: ${(props) => props.$active ? 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' : props.theme.bg};
  color: ${(props) => props.$active ? '#fff' : props.theme.textSec};
  border: 1px solid ${(props) => props.$active ? 'transparent' : props.theme.border};
  padding: 8px 14px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  display: flex; align-items: center; gap: 6px;
  &:hover { transform: translateY(-2px); border-color: #1dd1a1; color: ${(props) => props.$active ? '#fff' : props.theme.text}; }
`;

const NativeTimeChip = styled.input`
  background: ${(props) => props.$active ? 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' : props.theme.bg};
  color: ${(props) => props.$active ? '#fff' : props.theme.textSec};
  border: 1px solid ${(props) => props.$active ? 'transparent' : props.theme.border};
  padding: 5px 12px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; font-family: inherit; height: 35px; outline: none;

  &:hover { border-color: #1dd1a1; color: ${(props) => props.$active ? '#fff' : props.theme.text}; }

  /* Робимо іконку годинника красивою для Chrome/Edge */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: ${(props) => props.$active ? 'brightness(0) invert(1)' : (props.theme.bg === '#0f172a' ? 'invert(1)' : 'none')};
  }
`;

const Home = ({ toggleTheme, currentTheme }) => {
  const navigate = useNavigate();
  const [user] = useState(() => { const saved = localStorage.getItem("user"); return saved ? JSON.parse(saved) : null; });
  
  const [habits, setHabits] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [chartInterval, setChartInterval] = useState(7);
  const [chartHabitId, setChartHabitId] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const [newReminderTime, setNewReminderTime] = useState("");
  const [editReminderTime, setEditReminderTime] = useState("");

  const API_URL = "https://habit-tracker-wtyx.onrender.com/api"; 

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${API_URL}/habits`, { headers: { "auth-token": user?.token } });
      setHabits(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (!user) navigate("/login"); else fetchHabits(); }, [user, navigate]);

  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    const datesSet = new Set(completedDates);
    let streak = 0; let currentDate = new Date(); let dateStr = currentDate.toISOString().split('T')[0];
    if (datesSet.has(dateStr)) { streak++; currentDate.setDate(currentDate.getDate() - 1); } 
    else {
      currentDate.setDate(currentDate.getDate() - 1); dateStr = currentDate.toISOString().split('T')[0];
      if (datesSet.has(dateStr)) { streak++; currentDate.setDate(currentDate.getDate() - 1); } else { return 0; }
    }
    while (true) {
      dateStr = currentDate.toISOString().split('T')[0];
      if (datesSet.has(dateStr)) { streak++; currentDate.setDate(currentDate.getDate() - 1); } else { break; }
    }
    return streak;
  };

  const getSortedHabits = () => {
    return [...habits].sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "date_asc") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name_asc") return a.title.localeCompare(b.title);
      if (sortBy === "streak_desc") return calculateStreak(b.completedDates) - calculateStreak(a.completedDates);
      return 0;
    });
  };

  const sortedHabits = getSortedHabits();

  const getAIAdvice = async () => {
    setIsAiLoading(true);
    try {
      const res = await axios.post(`${API_URL}/ai/suggest`, { habits }, { headers: { "auth-token": user?.token } });
      setAiAdvice(res.data.advice);
    } catch (err) { setAiAdvice("Не вдалося підключитися до помічника 😔"); }
    setIsAiLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/habits`, { 
        title: newTitle, description: newDesc, reminderTime: newReminderTime 
      }, { headers: { "auth-token": user?.token } });
      setHabits([res.data, ...habits]);
      setNewTitle(""); setNewDesc(""); setNewReminderTime("");
    } catch (err) { alert("Помилка створення!"); }
  };

  const startEdit = (habit) => { 
    setEditingId(habit._id); setEditTitle(habit.title); setEditDesc(habit.description || ""); setEditReminderTime(habit.reminderTime || ""); 
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/habits/${id}/edit`, { 
        title: editTitle, description: editDesc, reminderTime: editReminderTime 
      }, { headers: { "auth-token": user?.token } });
      setHabits(habits.map(h => h._id === id ? { ...h, title: res.data.title, description: res.data.description, reminderTime: res.data.reminderTime } : h));
      setEditingId(null);
    } catch (err) { alert("Помилка оновлення!"); }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`${API_URL}/habits/${id}/toggle`, {}, { headers: { "auth-token": user?.token } });
      fetchHabits();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Видалити цю звичку?")) return;
    try {
      await axios.delete(`${API_URL}/habits/${id}`, { headers: { "auth-token": user?.token } });
      setHabits(habits.filter(h => h._id !== id));
    } catch (err) { console.error(err); }
  };

  const logout = () => { localStorage.removeItem("user"); window.location.href = "/login"; };
  const isDoneToday = (habit) => habit.completedDates.includes(new Date().toISOString().split('T')[0]);
  const handleTextareaInput = (e) => { e.target.style.height = 'auto'; e.target.style.height = (e.target.scrollHeight) + 'px'; };

  const isCustomTime = (time) => time !== "" && time !== "08:00" && time !== "14:00" && time !== "20:00";

  if (!user) return null;

  return (
    <PageWrapper>
      <MainContainer>
        <HeaderBar>
          <Greeting>Привіт, <span>{user?.username}</span> 👋</Greeting>
          <HeaderActions>
            <Link to="/profile" style={{ textDecoration: 'none' }}><IconButton title="Профіль">👤</IconButton></Link>
            <IconButton onClick={toggleTheme}>{currentTheme === 'light' ? <FaMoon /> : <FaSun />}</IconButton>
            <OutlineButton onClick={logout}>Вийти</OutlineButton>
          </HeaderActions>
        </HeaderBar>

        <AICard>
          <AITrigger onClick={getAIAdvice} disabled={isAiLoading}><FaMagic /> {isAiLoading ? "Аналізую..." : "ШІ Асистент"}</AITrigger>
          {aiAdvice && <AIResponse>✨ {aiAdvice}</AIResponse>}
        </AICard>

        <FormCard onSubmit={handleAdd}>
          <InputsWrapper>
            <CleanInput placeholder="Яку звичку плануємо?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <CleanTextarea placeholder="Деталі..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} onInput={handleTextareaInput} />
            
            <ReminderWrapper>
              <ReminderHeader><FaClock /> Коли нагадати?</ReminderHeader>
              <TimeChipContainer>
                <TimeChip type="button" $active={newReminderTime === ""} onClick={() => setNewReminderTime("")}>
                  <FaTimes style={{fontSize: '0.75rem', color: newReminderTime === "" ? 'white' : '#ff6b6b'}}/> Вимк.
                </TimeChip>
                <TimeChip type="button" $active={newReminderTime === "08:00"} onClick={() => setNewReminderTime("08:00")}>🌅 08:00</TimeChip>
                <TimeChip type="button" $active={newReminderTime === "14:00"} onClick={() => setNewReminderTime("14:00")}>☀️ 14:00</TimeChip>
                <TimeChip type="button" $active={newReminderTime === "20:00"} onClick={() => setNewReminderTime("20:00")}>🌙 20:00</TimeChip>
                
                <NativeTimeChip 
                  type="time" 
                  $active={isCustomTime(newReminderTime)}
                  value={isCustomTime(newReminderTime) ? newReminderTime : ""}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  title="Обрати інший час"
                />

              </TimeChipContainer>
            </ReminderWrapper>
          </InputsWrapper>
          
          <FormActions>
            <PrimaryButton type="submit"><FaPlus /> Створити</PrimaryButton>
          </FormActions>
        </FormCard>

        {habits.length > 0 && (
          <ListHeader>
            <h2>Мої звички</h2>
            <SortContainer>
              <FaSortAmountDown />
              <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date_desc">Новіші</option>
                <option value="date_asc">Старіші</option>
                <option value="name_asc">А-Я</option>
                <option value="streak_desc">🔥 Найбільша серія</option>
              </SortSelect>
            </SortContainer>
          </ListHeader>
        )}

        <HabitsGrid>
          {sortedHabits.map((habit) => (
            <HabitItem key={habit._id} $editing={editingId === habit._id}>
              {editingId === habit._id ? (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <CleanInput style={{ padding: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <CleanTextarea style={{ padding: '10px 0', minHeight: '60px' }} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} onInput={handleTextareaInput} />
                  
                  <ReminderWrapper>
                    <ReminderHeader><FaClock /> Змінити час</ReminderHeader>
                    <TimeChipContainer>
                      <TimeChip type="button" $active={editReminderTime === ""} onClick={() => setEditReminderTime("")}>
                        <FaTimes style={{fontSize: '0.75rem', color: editReminderTime === "" ? 'white' : '#ff6b6b'}}/> Вимк.
                      </TimeChip>
                      <TimeChip type="button" $active={editReminderTime === "08:00"} onClick={() => setEditReminderTime("08:00")}>🌅 08:00</TimeChip>
                      <TimeChip type="button" $active={editReminderTime === "14:00"} onClick={() => setEditReminderTime("14:00")}>☀️ 14:00</TimeChip>
                      <TimeChip type="button" $active={editReminderTime === "20:00"} onClick={() => setEditReminderTime("20:00")}>🌙 20:00</TimeChip>
                      
                      <NativeTimeChip 
                        type="time" 
                        $active={isCustomTime(editReminderTime)}
                        value={isCustomTime(editReminderTime) ? editReminderTime : ""}
                        onChange={(e) => setEditReminderTime(e.target.value)}
                        title="Обрати інший час"
                      />

                    </TimeChipContainer>
                  </ReminderWrapper>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <ActionIconBtn onClick={() => setEditingId(null)} $hoverColor="#ff6b6b"><FaTimes /> Скасувати</ActionIconBtn>
                    <PrimaryButton style={{ height: '38px', padding: '0 15px', fontSize: '0.9rem' }} onClick={() => handleSaveEdit(habit._id)}><FaSave /> Зберегти</PrimaryButton>
                  </div>
                </div>
              ) : (
                <>
                  <HabitContent>
                    <h3>{habit.title}</h3>
                    {habit.description && <p className="desc">{habit.description}</p>}
                    <p className="streak">
                      🔥 Серія: {calculateStreak(habit.completedDates)} днів 
                      {habit.reminderTime && <span style={{ marginLeft: '10px', color: '#1dd1a1' }}>⏰ {habit.reminderTime}</span>}
                    </p>
                  </HabitContent>
                  
                  <HabitControls>
                    <ActionIconBtn onClick={() => startEdit(habit)} $color="#4a69bd" $hoverBg="rgba(74, 105, 189, 0.1)" $hoverColor="#6a89cc"><FaEdit /></ActionIconBtn>
                    <ActionIconBtn onClick={() => handleDelete(habit._id)} $color="#ff6b6b" $hoverBg="rgba(255, 107, 107, 0.1)" $hoverColor="#ff4757"><FaTrash /></ActionIconBtn>
                    <CheckCircle $done={isDoneToday(habit)} onClick={() => handleToggle(habit._id)}><FaCheck /></CheckCircle>
                  </HabitControls>
                </>
              )}
            </HabitItem>
          ))}
          {habits.length === 0 && <EmptyState><p>У тебе ще немає звичок. Час створити першу! 🚀</p></EmptyState>}
        </HabitsGrid>

        {habits.length > 0 && (
          <div style={{ background: 'var(--card-bg, transparent)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color, transparent)' }}>
            <ChartHeader>
              <h3>Активність</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <IntervalSelect value={chartHabitId} onChange={(e) => setChartHabitId(e.target.value)}>
                  <option value="all">Усі звички</option>
                  {habits.map(h => (
                    <option key={h._id} value={h._id}>{h.title}</option>
                  ))}
                </IntervalSelect>
                <IntervalSelect value={chartInterval} onChange={(e) => setChartInterval(Number(e.target.value))}>
                  <option value={7}>7 днів</option>
                  <option value={14}>14 днів</option>
                  <option value={30}>30 днів</option>
                </IntervalSelect>
              </div>
            </ChartHeader>
            <StatChart habits={habits} currentTheme={currentTheme} interval={chartInterval} selectedHabitId={chartHabitId} />
          </div>
        )}
      </MainContainer>
    </PageWrapper>
  );
};

export default Home;