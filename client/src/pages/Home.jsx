import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaCheck, FaTrash, FaPlus, FaMoon, FaSun, FaMagic, 
  FaEdit, FaSave, FaTimes, FaSortAmountDown, FaClock, 
  FaStickyNote, FaSignOutAlt, FaUser, FaBullseye, FaBell 
} from "react-icons/fa";
import StatChart from "../components/StatChart";
import NotesSidebar from "../components/NotesSidebar";

import {
  PageWrapper, MainContainer, HeaderBar, Greeting, HeaderActions, IconButton, ProfileAvatarBtn, LogoutBtn,
  AICard, AITrigger, AIResponse, FormCard, InputsWrapper, StyledSelect, CleanInput, CleanTextarea, PrimaryButton, OutlineButton,
  ListHeader, SortContainer, SortSelect, HabitsGrid, HabitItem, HabitContent, HabitControls,
  ActionIconBtn, CheckCircle, EmptyState, ChartHeader, IntervalSelect,
  ReminderWrapper, ReminderLeft, ReminderHeader, TimeChipContainer, TimeChip, NativeTimeChip,
  ModalOverlay, ModalContent, ModalHeader, GoalInputGroup, GeneratedList, GeneratedItem
} from "./Home.styles";

const Home = ({ toggleTheme, currentTheme }) => {
  const navigate = useNavigate();
  const [user] = useState(() => { const saved = localStorage.getItem("user"); return saved ? JSON.parse(saved) : null; });
  
  const [habits, setHabits] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Стейт для створення
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [reminderType, setReminderType] = useState("none");
  const [frequency, setFrequency] = useState("daily");
  const [specificDays, setSpecificDays] = useState([]);

  // Стейт для редагування
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editReminderTime, setEditReminderTime] = useState("");
  const [editReminderType, setEditReminderType] = useState("none");
  const [editFrequency, setEditFrequency] = useState("daily");
  const [editSpecificDays, setEditSpecificDays] = useState([]);

  // Інші стейти
  const [chartInterval, setChartInterval] = useState(7);
  const [chartHabitId, setChartHabitId] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Стейт для генератора цілей
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [isGeneratingGoal, setIsGeneratingGoal] = useState(false);
  const [generatedHabits, setGeneratedHabits] = useState([]);

  const API_URL = "https://habit-tracker-wtyx.onrender.com/api"; 
  const DAYS_OF_WEEK = [
    { index: 1, label: 'Пн' },
    { index: 2, label: 'Вв' },
    { index: 3, label: 'Ср' },
    { index: 4, label: 'Чт' },
    { index: 5, label: 'Пт' },
    { index: 6, label: 'Сб' },
    { index: 0, label: 'Нд' }
  ];

  const fetchData = async () => {
    try {
      const [habitsRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/habits`, { headers: { "auth-token": user?.token } }),
        axios.get(`${API_URL}/users/me`, { headers: { "auth-token": user?.token } })
      ]);
      setHabits(habitsRes.data);
      setUserProfile(userRes.data);
    } catch (err) { console.error("Помилка завантаження даних", err); }
  };

  useEffect(() => { 
    if (!user) navigate("/login"); 
    else fetchData(); 
  }, [user, navigate]);

  // ПІДПИСКА НА WEB PUSH
  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator)) {
      alert("Ваш браузер не підтримує пуш-сповіщення.");
      return;
    }
    
    try {
      const register = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      const { data: publicKey } = await axios.get(`${API_URL}/notifications/vapid-public-key`);
      
      const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
        return outputArray;
      };

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      await axios.post(`${API_URL}/notifications/subscribe`, subscription, { headers: { "auth-token": user?.token } });
      alert("Пуш-сповіщення успішно увімкнено! 🔔");
    } catch (err) {
      console.error("Помилка підписки на пуш:", err);
      alert("Помилка налаштування сповіщень. Перевірте дозволи браузера.");
    }
  };

  const totalCompletions = habits.reduce((acc, habit) => acc + (habit.completedDates?.length || 0), 0);
  const userLevel = userProfile?.stats?.level || (Math.floor(totalCompletions / 10) + 1);

  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    const datesSet = new Set(completedDates);
    let streak = 0; let currentDate = new Date(); let dateStr = currentDate.toISOString().split('T')[0];
    
    if (datesSet.has(dateStr)) { streak++; currentDate.setDate(currentDate.getDate() - 1); } 
    else {
      currentDate.setDate(currentDate.getDate() - 1); dateStr = currentDate.toISOString().split('T')[0];
      if (datesSet.has(dateStr)) { streak++; currentDate.setDate(currentDate.getDate() - 1); } 
      else { return 0; }
    }
    
    while (true) {
      dateStr = currentDate.toISOString().split('T')[0];
      if (datesSet.has(dateStr)) { streak++; currentDate.setDate(currentDate.getDate() - 1); } 
      else { break; }
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
        title: newTitle, 
        description: newDesc, 
        reminderTime: newReminderTime,
        reminderType,
        frequency,
        specificDays
      }, { headers: { "auth-token": user?.token } });
      
      setHabits([res.data, ...habits]);
      setNewTitle(""); setNewDesc(""); setNewReminderTime("");
      setReminderType("none"); setFrequency("daily"); setSpecificDays([]);
    } catch (err) { alert("Помилка створення!"); }
  };

  const startEdit = (habit) => { 
    setEditingId(habit._id); 
    setEditTitle(habit.title); 
    setEditDesc(habit.description || ""); 
    setEditReminderTime(habit.reminderTime || ""); 
    setEditReminderType(habit.reminderType || "none");
    setEditFrequency(habit.frequency || "daily");
    setEditSpecificDays(habit.specificDays || []);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/habits/${id}/edit`, { 
        title: editTitle, 
        description: editDesc, 
        reminderTime: editReminderTime,
        reminderType: editReminderType,
        frequency: editFrequency,
        specificDays: editSpecificDays
      }, { headers: { "auth-token": user?.token } });
      
      setHabits(habits.map(h => h._id === id ? { 
        ...h, 
        title: res.data.title, 
        description: res.data.description, 
        reminderTime: res.data.reminderTime,
        reminderType: res.data.reminderType,
        frequency: res.data.frequency,
        specificDays: res.data.specificDays
      } : h));
      setEditingId(null);
    } catch (err) { alert("Помилка оновлення!"); }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`${API_URL}/habits/${id}/toggle`, {}, { headers: { "auth-token": user?.token } });
      fetchData(); 
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Видалити цю звичку?")) return;
    try {
      await axios.delete(`${API_URL}/habits/${id}`, { headers: { "auth-token": user?.token } });
      setHabits(habits.filter(h => h._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleGenerateGoal = async () => {
    if (!goalInput.trim()) return;
    setIsGeneratingGoal(true);
    try {
      const res = await axios.post(`${API_URL}/ai/breakdown`, { goal: goalInput }, { headers: { "auth-token": user?.token } });
      const parsedHabits = res.data.map(h => ({ ...h, selected: true }));
      setGeneratedHabits(parsedHabits);
    } catch (err) {
      alert("ШІ не зміг розібрати цю ціль. Спробуй перефразувати.");
    } finally {
      setIsGeneratingGoal(false);
    }
  };

  const handleToggleGeneratedHabit = (index) => {
    const updated = [...generatedHabits];
    updated[index].selected = !updated[index].selected;
    setGeneratedHabits(updated);
  };

  const handleSaveGeneratedHabits = async () => {
    const selectedHabits = generatedHabits.filter(h => h.selected);
    if (selectedHabits.length === 0) return;

    for (const habit of selectedHabits) {
      await axios.post(`${API_URL}/habits`, {
        title: habit.title,
        description: habit.description,
        reminderTime: habit.reminderTime,
        reminderType: "none",
        frequency: "daily",
        specificDays: []
      }, { headers: { "auth-token": user?.token } });
    }
    
    setIsGoalModalOpen(false);
    setGoalInput("");
    setGeneratedHabits([]);
    fetchData();
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
          <Greeting>
            Привіт, <span>{user?.username}</span> 
            <span style={{ fontSize: '0.85rem', color: '#1dd1a1', background: 'rgba(29, 209, 161, 0.1)', padding: '4px 10px', borderRadius: '8px', verticalAlign: 'middle', marginLeft: '10px' }}>
              LVL {userLevel}
            </span>
          </Greeting>
          
          <HeaderActions>
            <IconButton title="Увімкнути пуш-сповіщення" onClick={subscribeToPush}>
              <FaBell />
            </IconButton>
            <IconButton title="Змінити тему" onClick={toggleTheme}>
              {currentTheme === 'light' ? <FaMoon /> : <FaSun />}
            </IconButton>
            <IconButton title="Нотатки" onClick={() => setIsNotesOpen(true)}>
              <FaStickyNote />
            </IconButton>
            
            <Link to="/profile" style={{ textDecoration: 'none' }} title="Мій профіль">
              <ProfileAvatarBtn>
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt="Профіль" />
                ) : (
                  <FaUser style={{ color: 'gray' }} />
                )}
              </ProfileAvatarBtn>
            </Link>

            <LogoutBtn onClick={logout} title="Вийти з акаунта">
              <FaSignOutAlt />
            </LogoutBtn>
          </HeaderActions>
        </HeaderBar>

        <AICard>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <AITrigger style={{ flex: 1, minWidth: '150px' }} onClick={getAIAdvice} disabled={isAiLoading}>
              <FaMagic /> {isAiLoading ? "Аналізую..." : "Порада від ШІ"}
            </AITrigger>
            <AITrigger 
              type="button" 
              style={{ flex: 1, minWidth: '150px', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', boxShadow: '0 8px 16px rgba(253, 160, 133, 0.25)' }} 
              onClick={() => setIsGoalModalOpen(true)}
            >
              <FaBullseye /> Розбити ціль
            </AITrigger>
          </div>
          {aiAdvice && <AIResponse>✨ {aiAdvice}</AIResponse>}
        </AICard>

        <FormCard onSubmit={handleAdd}>
          <InputsWrapper>
            <CleanInput placeholder="Яку звичку плануємо?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <CleanTextarea placeholder="Деталі..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} onInput={handleTextareaInput} />
            
            <ReminderWrapper>
              <ReminderLeft style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* 1. Блок часу */}
                <div>
                  <ReminderHeader><FaClock /> Коли нагадати?</ReminderHeader>
                  <TimeChipContainer>
                    <TimeChip type="button" $active={newReminderTime === ""} onClick={() => setNewReminderTime("")}>
                      <FaTimes style={{fontSize: '0.75rem', color: newReminderTime === "" ? 'white' : '#ff6b6b'}}/> Вимк.
                    </TimeChip>
                    <TimeChip type="button" $active={newReminderTime === "08:00"} onClick={() => setNewReminderTime("08:00")}>🌅 08:00</TimeChip>
                    <TimeChip type="button" $active={newReminderTime === "14:00"} onClick={() => setNewReminderTime("14:00")}>☀️ 14:00</TimeChip>
                    <TimeChip type="button" $active={newReminderTime === "20:00"} onClick={() => setNewReminderTime("20:00")}>🌙 20:00</TimeChip>
                    <NativeTimeChip type="time" $active={isCustomTime(newReminderTime)} value={isCustomTime(newReminderTime) ? newReminderTime : ""} onChange={(e) => setNewReminderTime(e.target.value)} title="Обрати інший час" />
                  </TimeChipContainer>
                </div>

                {/* 2. Блок налаштувань сповіщення */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <StyledSelect value={reminderType} onChange={(e) => setReminderType(e.target.value)}>
                    <option value="none">Без сповіщень</option>
                    <option value="push">🔔 Пуш на екран</option>
                    <option value="email">✉️ На Email</option>
                    <option value="both">🔔 + ✉️ Обидва</option>
                  </StyledSelect>

                  <StyledSelect value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    <option value="daily">Щодня</option>
                    <option value="weekly">Раз на тиждень (у Пн)</option>
                    <option value="monthly">Раз на місяць (1-го)</option>
                    <option value="specific_days">Обрані дні</option>
                  </StyledSelect>
                </div>

                {/* 3. Блок вибору днів (якщо вибрано specific_days) */}
                {frequency === "specific_days" && (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {DAYS_OF_WEEK.map((day) => (
                      <button 
                        key={day.index} type="button"
                        onClick={() => setSpecificDays(prev => prev.includes(day.index) ? prev.filter(d => d !== day.index) : [...prev, day.index])}
                        style={{
                          padding: '6px', borderRadius: '8px', width: '38px', height: '38px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
                          background: specificDays.includes(day.index) ? '#6a11cb' : 'transparent',
                          color: specificDays.includes(day.index) ? '#fff' : 'inherit',
                          border: specificDays.includes(day.index) ? '1px solid #6a11cb' : '1px solid rgba(106, 17, 203, 0.3)'
                        }}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                )}
              </ReminderLeft>
              
              <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <PrimaryButton type="submit" style={{ height: '44px' }}><FaPlus /> Створити</PrimaryButton>
              </div>
            </ReminderWrapper>
          </InputsWrapper>
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
                    <ReminderLeft style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      
                      <div>
                        <ReminderHeader><FaClock /> Змінити час</ReminderHeader>
                        <TimeChipContainer>
                          <TimeChip type="button" $active={editReminderTime === ""} onClick={() => setEditReminderTime("")}>
                            <FaTimes style={{fontSize: '0.75rem', color: editReminderTime === "" ? 'white' : '#ff6b6b'}}/> Вимк.
                          </TimeChip>
                          <TimeChip type="button" $active={editReminderTime === "08:00"} onClick={() => setEditReminderTime("08:00")}>🌅 08:00</TimeChip>
                          <TimeChip type="button" $active={editReminderTime === "14:00"} onClick={() => setEditReminderTime("14:00")}>☀️ 14:00</TimeChip>
                          <TimeChip type="button" $active={editReminderTime === "20:00"} onClick={() => setEditReminderTime("20:00")}>🌙 20:00</TimeChip>
                          <NativeTimeChip type="time" $active={isCustomTime(editReminderTime)} value={isCustomTime(editReminderTime) ? editReminderTime : ""} onChange={(e) => setEditReminderTime(e.target.value)} title="Обрати інший час" />
                        </TimeChipContainer>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <StyledSelect value={editReminderType} onChange={(e) => setEditReminderType(e.target.value)}>
                          <option value="none">Без сповіщень</option>
                          <option value="push">🔔 Пуш</option>
                          <option value="email">✉️ Email</option>
                          <option value="both">Обидва</option>
                        </StyledSelect>

                        <StyledSelect value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)}>
                          <option value="daily">Щодня</option>
                          <option value="weekly">Тиждень</option>
                          <option value="monthly">Місяць</option>
                          <option value="specific_days">Обрані дні</option>
                        </StyledSelect>
                      </div>

                      {editFrequency === "specific_days" && (
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {DAYS_OF_WEEK.map((day) => (
                            <button 
                              key={day.index} type="button"
                              onClick={() => setEditSpecificDays(prev => prev.includes(day.index) ? prev.filter(d => d !== day.index) : [...prev, day.index])}
                              style={{
                                padding: '6px', borderRadius: '8px', width: '38px', height: '38px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
                                background: editSpecificDays.includes(day.index) ? '#6a11cb' : 'transparent',
                                color: editSpecificDays.includes(day.index) ? '#fff' : 'inherit',
                                border: editSpecificDays.includes(day.index) ? '1px solid #6a11cb' : '1px solid rgba(106, 17, 203, 0.3)'
                              }}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </ReminderLeft>
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
      
      <NotesSidebar 
        isOpen={isNotesOpen} 
        onClose={() => setIsNotesOpen(false)} 
        userToken={user?.token} 
      />

      {isGoalModalOpen && (
        <ModalOverlay onClick={(e) => { if(e.target === e.currentTarget) setIsGoalModalOpen(false); }}>
          <ModalContent>
            <ModalHeader>
              <h3><FaBullseye style={{color: '#6a11cb'}}/> Досягти цілі</h3>
              <FaTimes onClick={() => setIsGoalModalOpen(false)} style={{cursor: 'pointer', color: 'gray'}}/>
            </ModalHeader>
            
            <p style={{margin: '0', fontSize: '0.9rem', color: 'gray'}}>
              Опиши глобальну мету, а ШІ розіб'є її на щоденні звички з ідеальним часом.
            </p>
            
            <GoalInputGroup>
              <input 
                type="text" 
                placeholder="Наприклад: Вивчити програмування..." 
                value={goalInput} 
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateGoal()}
              />
              <button onClick={handleGenerateGoal} disabled={isGeneratingGoal || !goalInput.trim()}>
                {isGeneratingGoal ? "Магія..." : "Генерувати"}
              </button>
            </GoalInputGroup>

            {generatedHabits.length > 0 && (
              <>
                <GeneratedList>
                  {generatedHabits.map((habit, index) => (
                    <GeneratedItem key={index} $selected={habit.selected}>
                      <input type="checkbox" checked={habit.selected} onChange={() => handleToggleGeneratedHabit(index)} />
                      <div className="info">
                        <h4>{habit.title}</h4>
                        <p>{habit.description}</p>
                        <span className="time"><FaClock style={{marginRight: '4px'}}/> {habit.reminderTime}</span>
                      </div>
                    </GeneratedItem>
                  ))}
                </GeneratedList>
                
                <PrimaryButton 
                  style={{ 
                    marginTop: '15px', 
                    minHeight: '50px', 
                    height: 'auto', 
                    padding: '12px 20px',
                    fontSize: '1rem'
                  }} 
                  onClick={handleSaveGeneratedHabits}
                >
                  <FaPlus /> Додати обрані звички у трекер
                </PrimaryButton>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

    </PageWrapper>
  );
};

export default Home;