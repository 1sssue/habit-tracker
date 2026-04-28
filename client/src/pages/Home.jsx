import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaCheck, FaTrash, FaPlus, FaMoon, FaSun, FaMagic, 
  FaEdit, FaSave, FaTimes, FaSortAmountDown, FaClock, 
  FaStickyNote, FaSignOutAlt, FaUser, FaBullseye, FaBell, FaCalendarAlt, FaSyncAlt, FaThumbtack
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
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  // Стейт для створення
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderDate, setNewReminderDate] = useState(""); 
  const [reminderType, setReminderType] = useState("none");
  const [frequency, setFrequency] = useState("daily");
  const [specificDays, setSpecificDays] = useState([]);
  const [newWeeklyDay, setNewWeeklyDay] = useState("1"); 
  const [newMonthlyDay, setNewMonthlyDay] = useState("1"); 
  const [newMonthlyMonth, setNewMonthlyMonth] = useState("0"); 
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  // Стейт для редагування
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editReminderTime, setEditReminderTime] = useState("");
  const [editReminderDate, setEditReminderDate] = useState(""); 
  const [editReminderType, setEditReminderType] = useState("none");
  const [editFrequency, setEditFrequency] = useState("daily");
  const [editSpecificDays, setEditSpecificDays] = useState([]);
  const [editWeeklyDay, setEditWeeklyDay] = useState("1");
  const [editMonthlyDay, setEditMonthlyDay] = useState("1");
  const [editMonthlyMonth, setEditMonthlyMonth] = useState("0");

  // Інші стейти
  const [chartInterval, setChartInterval] = useState(7);
  const [chartHabitId, setChartHabitId] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [isGeneratingGoal, setIsGeneratingGoal] = useState(false);
  const [generatedHabits, setGeneratedHabits] = useState([]);

  const API_URL = "https://habit-tracker-wtyx.onrender.com/api"; 
  const DAYS_OF_WEEK = [
    { index: 1, label: 'Пн' }, { index: 2, label: 'Вв' }, { index: 3, label: 'Ср' },
    { index: 4, label: 'Чт' }, { index: 5, label: 'Пт' }, { index: 6, label: 'Сб' }, { index: 0, label: 'Нд' }
  ];
  const MONTHS = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

  useEffect(() => {
      const checkPushStatus = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
              const subscription = await registration.pushManager.getSubscription();
              if (subscription && Notification.permission === 'granted') {
                setIsPushEnabled(true);
              }
            }
          } catch (error) { console.error("Помилка перевірки статусу пушів:", error); }
        }
      };
      checkPushStatus();
    }, []);

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

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator)) { alert("Браузер не підтримує пуш-сповіщення."); return; }
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

      const subscription = await register.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
      await axios.post(`${API_URL}/notifications/subscribe`, subscription, { headers: { "auth-token": user?.token } });
      
      setIsPushEnabled(true);
      alert("Пуш-сповіщення успішно увімкнено! 🔔");
    } catch (err) { alert("Помилка налаштування сповіщень."); }
  };

  const totalCompletions = habits.reduce((acc, habit) => acc + (habit.completedDates?.length || 0), 0);
  const userLevel = userProfile?.stats?.level || (Math.floor(totalCompletions / 10) + 1);

  // --- ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ ДАТ І СЕРІЙ ---
  const checkDateStr = (dateObj) => {
      const d = new Date(dateObj);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
  };

  const isDayRequired = (dateObj, habit) => {
      if (!habit) return false;
      if (habit.frequency === 'daily') return true;
      if (habit.frequency === 'weekly') return dateObj.getDay().toString() === habit.weeklyDay;
      if (habit.frequency === 'monthly') return dateObj.getDate().toString() === habit.monthlyDay;
      if (habit.frequency === 'specific_days') return habit.specificDays.includes(dateObj.getDay());
      if (habit.frequency === 'once') return checkDateStr(dateObj) === habit.reminderDate;
      return true;
  };

  const calculateStreak = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const datesSet = new Set(habit.completedDates);
    let streak = 0;
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const todayStr = checkDateStr(currentDate);

    while (true) {
        // Якщо сьогодні звичку виконувати не треба, йдемо в минуле на 1 день
        if (!isDayRequired(currentDate, habit)) {
            currentDate.setDate(currentDate.getDate() - 1);
            continue;
        }

        let loopDateStr = checkDateStr(currentDate);
        
        if (datesSet.has(loopDateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            // Якщо звичку треба було виконати сьогодні, але ще не виконано - не обриваємо серію до кінця дня
            if (loopDateStr === todayStr) {
                currentDate.setDate(currentDate.getDate() - 1);
                continue;
            } else {
                break; 
            }
        }
    }
    return streak;
  };

  const getSortedHabits = () => {
    return [...habits].sort((a, b) => {
      // Закріплені звички завжди зверху
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Далі стандартне сортування
      if (sortBy === "date_desc") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "date_asc") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name_asc") return a.title.localeCompare(b.title);
      if (sortBy === "streak_desc") return calculateStreak(b) - calculateStreak(a);
      return 0;
    });
  };

  const sortedHabits = getSortedHabits();

  const getAIAdvice = async () => {
    setIsAiLoading(true);
    try {
      const res = await axios.post(`${API_URL}/ai/suggest`, { habits }, { headers: { "auth-token": user?.token } });
      setAiAdvice(res.data.advice);
    } catch (err) { 
      const errorMsg = err.response?.data?.error || "Не вдалося підключитися до помічника 😔";
      setAiAdvice(errorMsg); 
    }
    setIsAiLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/habits`, { 
        title: newTitle, description: newDesc, 
        reminderTime: newReminderTime, reminderDate: newReminderDate,
        reminderType, frequency, specificDays,
        weeklyDay: newWeeklyDay, monthlyDay: newMonthlyDay, monthlyMonth: newMonthlyMonth
      }, { headers: { "auth-token": user?.token } });
      
      setHabits([res.data, ...habits]);
      setNewTitle(""); setNewDesc(""); setNewReminderTime(""); setNewReminderDate("");
      setReminderType("none"); setFrequency("daily"); setSpecificDays([]); setShowReminderSettings(false);
      setNewWeeklyDay("1"); setNewMonthlyDay("1"); setNewMonthlyMonth("0");
    } catch (err) { alert("Помилка створення!"); }
  };

  const startEdit = (habit) => { 
    setEditingId(habit._id); 
    setEditTitle(habit.title); 
    setEditDesc(habit.description || ""); 
    setEditReminderTime(habit.reminderTime || ""); 
    setEditReminderDate(habit.reminderDate || "");
    setEditReminderType(habit.reminderType || "none");
    setEditFrequency(habit.frequency || "daily");
    setEditSpecificDays(habit.specificDays || []);
    setEditWeeklyDay(habit.weeklyDay || "1");
    setEditMonthlyDay(habit.monthlyDay || "1");
    setEditMonthlyMonth(habit.monthlyMonth || "0");
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/habits/${id}/edit`, { 
        title: editTitle, description: editDesc, 
        reminderTime: editReminderTime, reminderDate: editReminderDate,
        reminderType: editReminderType, frequency: editFrequency, specificDays: editSpecificDays,
        weeklyDay: editWeeklyDay, monthlyDay: editMonthlyDay, monthlyMonth: editMonthlyMonth
      }, { headers: { "auth-token": user?.token } });
      
      setHabits(habits.map(h => h._id === id ? { 
        ...h, title: res.data.title, description: res.data.description, 
        reminderTime: res.data.reminderTime, reminderDate: res.data.reminderDate, reminderType: res.data.reminderType, 
        frequency: res.data.frequency, specificDays: res.data.specificDays,
        weeklyDay: res.data.weeklyDay, monthlyDay: res.data.monthlyDay, monthlyMonth: res.data.monthlyMonth
      } : h));
      setEditingId(null);
    } catch (err) { alert("Помилка оновлення!"); }
  };

  // --- МИТТЄВЕ ВИКОНАННЯ (Optimistic UI) ---
  const handleToggle = async (habit) => {
    const todayStr = checkDateStr(new Date());
    const isCompleted = habit.completedDates.includes(todayStr);
    
    // Миттєво оновлюємо інтерфейс
    setHabits(prevHabits => prevHabits.map(h => {
        if (h._id === habit._id) {
            return {
                ...h,
                completedDates: isCompleted 
                    ? h.completedDates.filter(d => d !== todayStr) 
                    : [...h.completedDates, todayStr]
            };
        }
        return h;
    }));

    // Фоновий запит на сервер
    try {
      await axios.put(`${API_URL}/habits/${habit._id}/toggle`, {}, { headers: { "auth-token": user?.token } });
    } catch (err) { 
      console.error("Помилка синхронізації:", err); 
      fetchData(); // Відкат у разі помилки
    }
  };

  // --- ЗАКРІПЛЕННЯ ЗВИЧКИ ---
  const handlePin = async (id) => {
    // Миттєве оновлення
    setHabits(prevHabits => prevHabits.map(h => h._id === id ? { ...h, isPinned: !h.isPinned } : h));
    try {
        await axios.put(`${API_URL}/habits/${id}/pin`, {}, { headers: { "auth-token": user?.token } });
    } catch(err) {
        console.error("Помилка закріплення:", err);
        fetchData();
    }
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
      const errorMsg = err.response?.data?.error || "ШІ не зміг розібрати цю ціль.";
      alert(errorMsg); 
    } 
    finally { setIsGeneratingGoal(false); }
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
        title: habit.title, description: habit.description,
        reminderTime: habit.reminderTime, reminderDate: "",
        reminderType: "none", frequency: "daily", specificDays: []
      }, { headers: { "auth-token": user?.token } });
    }
    
    setIsGoalModalOpen(false); setGoalInput(""); setGeneratedHabits([]); fetchData();
  };

  const logout = () => { localStorage.removeItem("user"); window.location.href = "/login"; };
  
  const isDoneToday = (habit) => {
      const todayStr = checkDateStr(new Date());
      return habit.completedDates.includes(todayStr);
  };

  const handleTextareaInput = (e) => { e.target.style.height = 'auto'; e.target.style.height = (e.target.scrollHeight) + 'px'; };

  const getReminderText = (habit) => {
    let text = "";
    
    if (habit.frequency === 'daily') {
        text = "Щодня";
    } else if (habit.frequency === 'weekly') {
        const day = DAYS_OF_WEEK.find(d => String(d.index) === String(habit.weeklyDay));
        if (day) text = day.label;
    } else if (habit.frequency === 'specific_days' && habit.specificDays?.length > 0) {
        const sortedDays = [...habit.specificDays].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
        text = sortedDays.map(d => DAYS_OF_WEEK.find(dw => dw.index === d)?.label).join(", ");
    } else if (habit.frequency === 'monthly') {
        text = `${habit.monthlyDay}-го`;
    } else if (habit.frequency === 'once' && habit.reminderDate) {
        text = habit.reminderDate;
    }

    if (habit.reminderTime) {
        text = text ? `${text}, ${habit.reminderTime}` : habit.reminderTime;
    }

    return text ? `⏰ ${text}` : null;
  };

  if (!user) return null;

  return (
    <PageWrapper>
      <MainContainer>
        <HeaderBar>
          <Greeting>
            Привіт, <span>{user?.username}</span> 
            <span style={{ 
              display: 'inline-block', whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#1dd1a1', 
              background: 'rgba(29, 209, 161, 0.1)', padding: '4px 10px', borderRadius: '8px', 
              verticalAlign: 'middle', marginLeft: '10px' 
            }}>
              LVL {userLevel}
            </span>
          </Greeting>
          
          <HeaderActions>
            <IconButton title={isPushEnabled ? "Сповіщення увімкнені" : "Увімкнути пуш-сповіщення"} onClick={subscribeToPush} $active={isPushEnabled}><FaBell /></IconButton>
            <IconButton title="Змінити тему" onClick={toggleTheme}>{currentTheme === 'light' ? <FaMoon /> : <FaSun />}</IconButton>
            <IconButton title="Нотатки" onClick={() => setIsNotesOpen(true)}><FaStickyNote /></IconButton>
            <Link to="/profile" style={{ textDecoration: 'none' }} title="Мій профіль">
              <ProfileAvatarBtn>{userProfile?.avatar ? <img src={userProfile.avatar} alt="Профіль" /> : <FaUser style={{ color: 'gray' }} />}</ProfileAvatarBtn>
            </Link>
            <LogoutBtn onClick={logout} title="Вийти з акаунта"><FaSignOutAlt /></LogoutBtn>
          </HeaderActions>
        </HeaderBar>

        <AICard>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <AITrigger style={{ flex: 1, minWidth: '150px' }} onClick={getAIAdvice} disabled={isAiLoading}>
              <FaMagic /> {isAiLoading ? "Аналізую..." : "Порада від ШІ"}
            </AITrigger>
            <AITrigger type="button" style={{ flex: 1, minWidth: '150px', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', boxShadow: '0 8px 16px rgba(253, 160, 133, 0.25)' }} onClick={() => setIsGoalModalOpen(true)}>
              <FaBullseye /> Розбити ціль
            </AITrigger>
          </div>
          {aiAdvice && <AIResponse>✨ {aiAdvice}</AIResponse>}
        </AICard>

        <FormCard onSubmit={handleAdd}>
          <InputsWrapper>
            <CleanInput placeholder="Яку звичку плануємо?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <CleanTextarea placeholder="Деталі..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} onInput={handleTextareaInput} />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => setShowReminderSettings(!showReminderSettings)} 
                  style={{ 
                    flex: 1,
                    background: showReminderSettings 
                      ? (currentTheme === 'dark' ? 'rgba(195, 150, 255, 0.15)' : 'rgba(106, 17, 203, 0.1)')
                      : 'transparent', 
                    
                    border: '1px solid', 
                    borderColor: currentTheme === 'dark'
                      ? (showReminderSettings ? 'rgba(195, 150, 255, 0.6)' : 'rgba(195, 150, 255, 0.3)')
                      : (showReminderSettings ? 'rgba(106, 17, 203, 0.5)' : 'rgba(106, 17, 203, 0.2)'),
                    
                    color: currentTheme === 'dark' ? '#c396ff' : '#6a11cb', // Світла лаванда для темної теми
                    
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '8px', 
                    cursor: 'pointer', 
                    padding: '0 10px',
                    borderRadius: '10px',
                    transition: '0.2s',
                    fontSize: '0.9rem',
                    height: '38px',
                    whiteSpace: 'nowrap'
                  }}
                >
                   <FaClock /> {showReminderSettings ? "Сховати" : "Налаштувати розклад"}
                </button>
                {!showReminderSettings && (
                    <PrimaryButton type="submit" style={{ flex: 1, height: '38px', padding: '0 10px', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                        <FaPlus /> Створити
                    </PrimaryButton>
                )}
            </div>

            {showReminderSettings && (
                <ReminderWrapper>
                  
                  {/* БЛОК 1: ЧАС */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <ReminderHeader><FaClock /> О котрій годині?</ReminderHeader>
                    <NativeTimeChip 
                      type="time" 
                      value={newReminderTime} 
                      onChange={(e) => setNewReminderTime(e.target.value)} 
                      title="Обрати час" 
                      style={{ width: '100%', display: 'block' }} 
                    />
                    {newReminderTime !== "" && (
                      <button 
                        type="button" 
                        onClick={() => { setNewReminderTime(""); setReminderType("none"); }}
                        style={{ 
                          marginTop: '10px', 
                          background: 'rgba(255, 107, 107, 0.1)', 
                          border: '1px solid rgba(255, 107, 107, 0.3)', 
                          color: '#ff6b6b', 
                          borderRadius: '8px',
                          height: '38px',
                          cursor: 'pointer', 
                          fontSize: '0.9rem', 
                          fontWeight: '600',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '6px',
                          width: '100%',
                          transition: '0.2s'
                        }}
                      >
                        <FaTimes /> Очистити час
                      </button>
                    )}
                  </div>

                  {/* БЛОК 2: ПОВТОРЕННЯ */}
                  <div>
                    <ReminderHeader><FaSyncAlt /> Повторення</ReminderHeader>
                    <StyledSelect value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
                      <option value="daily">Щодня</option>
                      <option value="specific_days">Обрані дні тижня</option>
                      <option value="weekly">Раз на тиждень</option>
                      <option value="monthly">Раз на місяць</option>
                      <option value="once">Одноразово (в обрану дату)</option>
                    </StyledSelect>

                    {frequency === "once" && (
                        <NativeTimeChip type="date" value={newReminderDate} onChange={(e) => setNewReminderDate(e.target.value)} title="Обрати дату" style={{ width: '100%' }} />
                    )}

                    {frequency === "weekly" && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', width: '100%' }}>
                        {DAYS_OF_WEEK.map((day) => (
                          <button key={day.index} type="button"
                            onClick={() => setNewWeeklyDay(String(day.index))}
                            style={{
                              flex: 1,
                              padding: '6px 0', borderRadius: '8px', height: '38px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
                              background: newWeeklyDay === String(day.index) ? '#6a11cb' : 'transparent',
                              color: newWeeklyDay === String(day.index) ? '#fff' : 'inherit',
                              border: newWeeklyDay === String(day.index) ? '1px solid #6a11cb' : '1px solid rgba(106, 17, 203, 0.3)'
                            }}
                          >{day.label}</button>
                        ))}
                      </div>
                    )}

                    {frequency === "monthly" && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <StyledSelect value={newMonthlyDay} onChange={(e) => setNewMonthlyDay(e.target.value)} style={{ flex: 1 }}>
                                {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1} число</option>)}
                            </StyledSelect>
                            <StyledSelect value={newMonthlyMonth} onChange={(e) => setNewMonthlyMonth(e.target.value)} style={{ flex: 1 }}>
                                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </StyledSelect>
                        </div>
                    )}

                    {frequency === "specific_days" && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', width: '100%' }}>
                        {DAYS_OF_WEEK.map((day) => (
                          <button key={day.index} type="button"
                            onClick={() => setSpecificDays(prev => prev.includes(day.index) ? prev.filter(d => d !== day.index) : [...prev, day.index])}
                            style={{
                              flex: 1,
                              padding: '6px 0', borderRadius: '8px', height: '38px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
                              background: specificDays.includes(day.index) ? '#6a11cb' : 'transparent',
                              color: specificDays.includes(day.index) ? '#fff' : 'inherit',
                              border: specificDays.includes(day.index) ? '1px solid #6a11cb' : '1px solid rgba(106, 17, 203, 0.3)'
                            }}
                          >{day.label}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* БЛОК 3: КУДИ СЛАТИ */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%' }}>
                    <div>
                        <ReminderHeader><FaBell /> Куди надсилати?</ReminderHeader>
                        <StyledSelect value={reminderType} onChange={(e) => setReminderType(e.target.value)} style={{ width: '100%' }}>
                            <option value="none">🚫 Без нагадування</option>
                            <option value="push">🔔 Пуш на екран</option>
                            <option value="email">✉️ На Email</option>
                            <option value="both">🔔 + ✉️ Обидва</option>
                        </StyledSelect>
                    </div>
                    <PrimaryButton type="submit" style={{ height: '42px', width: '100%', marginTop: 'auto', borderRadius: '10px' }}><FaPlus /> Створити</PrimaryButton>
                  </div>
                  
                </ReminderWrapper>
            )}
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
          {sortedHabits.map((habit) => {
            const isActiveToday = isDayRequired(new Date(), habit);
            
            return (
            <HabitItem key={habit._id} $editing={editingId === habit._id} style={{ border: habit.isPinned ? '1px solid rgba(241, 196, 15, 0.4)' : 'none' }}>
              {editingId === habit._id ? (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <CleanInput style={{ padding: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <CleanTextarea style={{ padding: '10px 0', minHeight: '60px' }} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} onInput={handleTextareaInput} />
                  
                  <ReminderWrapper>
                      {/* БЛОК 1: ЧАС */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ReminderHeader><FaClock /> О котрій годині?</ReminderHeader>
                        <NativeTimeChip 
                          type="time" 
                          value={editReminderTime} 
                          onChange={(e) => setEditReminderTime(e.target.value)} 
                          title="Обрати час" 
                          style={{ width: '100%', display: 'block' }} 
                        />
                        {editReminderTime !== "" && (
                          <button 
                            type="button" 
                            onClick={() => { setEditReminderTime(""); setEditReminderType("none"); }}
                            style={{ 
                              marginTop: '10px', 
                              background: 'rgba(255, 107, 107, 0.1)', 
                              border: '1px solid rgba(255, 107, 107, 0.3)', 
                              color: '#ff6b6b', 
                              borderRadius: '8px', 
                              height: '38px',     
                              cursor: 'pointer', 
                              fontSize: '0.9rem', 
                              fontWeight: '600',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              gap: '6px',
                              width: '100%',
                              transition: '0.2s'
                            }}
                          >
                            <FaTimes /> Очистити час
                          </button>
                        )}
                      </div>

                      {/* БЛОК 2: ПОВТОРЕННЯ */}
                      <div>
                        <ReminderHeader><FaSyncAlt /> Повторення</ReminderHeader>
                        <StyledSelect value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
                          <option value="daily">Щодня</option>
                          <option value="specific_days">Обрані дні тижня</option>
                          <option value="weekly">Раз на тиждень</option>
                          <option value="monthly">Раз на місяць</option>
                          <option value="once">Одноразово (в обрану дату)</option>
                        </StyledSelect>

                        {editFrequency === "once" && (
                            <NativeTimeChip type="date" value={editReminderDate} onChange={(e) => setEditReminderDate(e.target.value)} title="Обрати дату" style={{ width: '100%' }} />
                        )}

                        {editFrequency === "weekly" && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', width: '100%' }}>
                            {DAYS_OF_WEEK.map((day) => (
                              <button key={day.index} type="button"
                                onClick={() => setEditWeeklyDay(String(day.index))}
                                style={{
                                  flex: 1,
                                  padding: '6px 0', borderRadius: '8px', height: '38px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
                                  background: editWeeklyDay === String(day.index) ? '#6a11cb' : 'transparent',
                                  color: editWeeklyDay === String(day.index) ? '#fff' : 'inherit',
                                  border: editWeeklyDay === String(day.index) ? '1px solid #6a11cb' : '1px solid rgba(106, 17, 203, 0.3)'
                                }}
                              >{day.label}</button>
                            ))}
                          </div>
                        )}

                        {editFrequency === "monthly" && (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <StyledSelect value={editMonthlyDay} onChange={(e) => setEditMonthlyDay(e.target.value)} style={{ flex: 1 }}>
                                    {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1} число</option>)}
                                </StyledSelect>
                                <StyledSelect value={editMonthlyMonth} onChange={(e) => setEditMonthlyMonth(e.target.value)} style={{ flex: 1 }}>
                                    {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                </StyledSelect>
                            </div>
                        )}

                        {editFrequency === "specific_days" && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', width: '100%' }}>
                            {DAYS_OF_WEEK.map((day) => (
                              <button key={day.index} type="button"
                                onClick={() => setEditSpecificDays(prev => prev.includes(day.index) ? prev.filter(d => d !== day.index) : [...prev, day.index])}
                                style={{
                                  flex: 1,
                                  padding: '6px 0', borderRadius: '8px', height: '38px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
                                  background: editSpecificDays.includes(day.index) ? '#6a11cb' : 'transparent',
                                  color: editSpecificDays.includes(day.index) ? '#fff' : 'inherit',
                                  border: editSpecificDays.includes(day.index) ? '1px solid #6a11cb' : '1px solid rgba(106, 17, 203, 0.3)'
                                }}
                              >{day.label}</button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* БЛОК 3: КУДИ СЛАТИ */}
                      <div>
                          <ReminderHeader><FaBell /> Куди надсилати?</ReminderHeader>
                          <StyledSelect value={editReminderType} onChange={(e) => setEditReminderType(e.target.value)} style={{ width: '100%' }}>
                              <option value="none">🚫 Без нагадування</option>
                              <option value="push">🔔 Пуш на екран</option>
                              <option value="email">✉️ На Email</option>
                              <option value="both">🔔 + ✉️ Обидва</option>
                          </StyledSelect>
                      </div>
                  </ReminderWrapper>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <ActionIconBtn 
                      onClick={() => setEditingId(null)} 
                      $hoverColor="#ff6b6b"
                      style={{ height: '42px', padding: '0 15px', fontSize: '0.95rem', gap: '6px', fontWeight: '600', borderRadius: '10px' }}
                    >
                      <FaTimes /> Скасувати
                    </ActionIconBtn>
                    <PrimaryButton 
                      style={{ height: '42px', padding: '0 20px', fontSize: '0.95rem', borderRadius: '10px' }} 
                      onClick={() => handleSaveEdit(habit._id)}
                    >
                      <FaSave /> Зберегти
                    </PrimaryButton>
                  </div>
                </div>
              ) : (
                <>
                  <HabitContent>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {habit.title} 
                        {habit.isPinned && <FaThumbtack style={{ color: '#f1c40f', fontSize: '0.9rem' }} title="Закріплено" />}
                    </h3>
                    {habit.description && <p className="desc">{habit.description}</p>}
                    <p className="streak">
                      🔥 Серія: {calculateStreak(habit)} {calculateStreak(habit) === 1 ? 'раз' : 'разів'}
                      {getReminderText(habit) && (
                        <span style={{ marginLeft: '10px', color: '#1dd1a1' }}>
                          {getReminderText(habit)}
                        </span>
                      )}
                    </p>
                  </HabitContent>
                  
                  <HabitControls>
                    <ActionIconBtn 
                        onClick={() => handlePin(habit._id)} 
                        $color={habit.isPinned ? "#f1c40f" : "#95a5a6"} 
                        $hoverBg="rgba(241, 196, 15, 0.1)" 
                        $hoverColor="#f1c40f" 
                        title={habit.isPinned ? "Відкріпити" : "Закріпити"}
                    >
                        <FaThumbtack />
                    </ActionIconBtn>
                    <ActionIconBtn onClick={() => startEdit(habit)} $color="#4a69bd" $hoverBg="rgba(74, 105, 189, 0.1)" $hoverColor="#6a89cc" title="Редагувати"><FaEdit /></ActionIconBtn>
                    <ActionIconBtn onClick={() => handleDelete(habit._id)} $color="#ff6b6b" $hoverBg="rgba(255, 107, 107, 0.1)" $hoverColor="#ff4757" title="Видалити"><FaTrash /></ActionIconBtn>
                    
                    <CheckCircle 
                        $done={isDoneToday(habit)} 
                        onClick={() => { if(isActiveToday) handleToggle(habit); }}
                        style={{ 
                            opacity: isActiveToday ? 1 : 0.2, 
                            cursor: isActiveToday ? 'pointer' : 'not-allowed',
                            filter: !isActiveToday ? 'grayscale(100%)' : 'none'
                        }}
                        title={isActiveToday ? "Відмітити виконання" : "Цю звичку сьогодні не потрібно виконувати"}
                    >
                        <FaCheck />
                    </CheckCircle>
                  </HabitControls>
                </>
              )}
            </HabitItem>
          )})}
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
      
      <NotesSidebar isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} userToken={user?.token} />

      {isGoalModalOpen && (
        <ModalOverlay onClick={(e) => { if(e.target === e.currentTarget) setIsGoalModalOpen(false); }}>
          <ModalContent>
            <ModalHeader>
              <h3><FaBullseye style={{color: '#6a11cb'}}/> Досягти цілі</h3>
              <FaTimes onClick={() => setIsGoalModalOpen(false)} style={{cursor: 'pointer', color: 'gray'}}/>
            </ModalHeader>
            <p style={{margin: '0', fontSize: '0.9rem', color: 'gray'}}>Опиши глобальну мету, а ШІ розіб'є її на щоденні звички з ідеальним часом.</p>
            <GoalInputGroup>
              <input type="text" placeholder="Наприклад: Вивчити програмування..." value={goalInput} onChange={(e) => setGoalInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerateGoal()}/>
              <button onClick={handleGenerateGoal} disabled={isGeneratingGoal || !goalInput.trim()}>{isGeneratingGoal ? "Магія..." : "Генерувати"}</button>
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
                    fontSize: '1rem',
                    width: '100%',
                    justifyContent: 'center'
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