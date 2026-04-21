import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaCamera, FaEnvelope, FaLock, FaShieldAlt, FaQuestionCircle } from "react-icons/fa";

import {
  PageWrapper, MainContainer, HeaderBar, BackBtn, PageTitle, ProfileCard,
  AvatarSection, AvatarWrapper, AvatarOverlay, HiddenFileInput, FileHint, FormGroup, Label, Input,
  ActionRow, PrimaryButton, EditButton, SecuritySection, SecurityNotice, MessageText,
  StatsCard, RankInfo, RankTitle, LevelBadge, ExpBarContainer, ExpFill, ExpText,
  TooltipContainer, TooltipBox
} from "./Profile.styles";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const fileInputRef = useRef(null);

  const [userToken] = useState(() => { const saved = localStorage.getItem("user"); return saved ? JSON.parse(saved).token : null; });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({ username: "", email: "", avatar: "" });
  const [securityData, setSecurityData] = useState({ newEmail: "", newPassword: "" });

  const API_URL = "https://habit-tracker-wtyx.onrender.com/api";

  useEffect(() => {
    if (!userToken) return navigate("/login");

    const fetchMe = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/me`, { headers: { "auth-token": userToken } });
        setFormData({ username: res.data.username, email: res.data.email, avatar: res.data.avatar || `https://ui-avatars.com/api/?name=${res.data.username}&background=1dd1a1&color=fff&size=150` });
        setStats(res.data.stats);
      } catch (err) { console.error(err); }
    };
    fetchMe();

    const queryParams = new URLSearchParams(location.search);
    const actionToken = queryParams.get("actionToken");
    if (actionToken) {
      confirmSecurityChange(actionToken);
      window.history.replaceState(null, "", "/profile"); 
    }
  }, [userToken, navigate, location.search]);

  const handleSaveProfile = async () => {
    setIsLoading(true); setMessage({ text: "", isError: false });
    try {
      await axios.put(`${API_URL}/users/update`, { username: formData.username, avatar: formData.avatar }, { headers: { "auth-token": userToken } });
      setMessage({ text: "Профіль успішно збережено!", isError: false });
      setIsEditing(false);
    } catch (err) {
      setMessage({ text: "Помилка при збереженні.", isError: true });
    } finally { setIsLoading(false); }
  };

  const requestSecurityChange = async () => {
    if (!securityData.newEmail && !securityData.newPassword) return setMessage({ text: "Заповніть нову пошту або пароль", isError: true });
    setIsLoading(true); setMessage({ text: "", isError: false });
    try {
      const res = await axios.post(`${API_URL}/users/request-security-change`, securityData, { headers: { "auth-token": userToken } });
      setMessage({ text: res.data.message, isError: false });
      setSecurityData({ newEmail: "", newPassword: "" }); 
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Помилка запиту.", isError: true });
    } finally { setIsLoading(false); }
  };

  const confirmSecurityChange = async (token) => {
    try {
      const res = await axios.post(`${API_URL}/users/confirm-security-change`, { token });
      setMessage({ text: `✅ ${res.data.message} Перезавантажте сторінку.`, isError: false });
    } catch (err) {
      setMessage({ text: "❌ Посилання недійсне або застаріло.", isError: true });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return setMessage({ text: "Помилка: Розмір фото не має перевищувати 2MB", isError: true });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result });
    }
  };

  const expPercentage = stats ? (stats.currentExp / stats.expToNextLevel) * 100 : 0;

  return (
    <PageWrapper>
      <MainContainer>
        <HeaderBar>
          <BackBtn onClick={() => navigate(-1)}><FaArrowLeft /></BackBtn>
          <PageTitle>Мій <span>Профіль</span></PageTitle>
          <div style={{width: '44px'}}></div> 
        </HeaderBar>

        {message.text && <MessageText $error={message.isError}>{message.text}</MessageText>}

        {stats && (
          <StatsCard>
            <RankInfo>
              <div>
                <RankTitle>
                  {stats.title} <span>LVL</span>
                  <TooltipContainer>
                    <FaQuestionCircle />
                    <TooltipBox className="tooltip-box">
                      <h4>Система рангів</h4>
                      <ul>
                        <li><strong>1-4 LVL:</strong> Новачок <em>(до 49 виконань)</em></li>
                        <li><strong>5-9 LVL:</strong> Досвідчений трекер <em>(до 99)</em></li>
                        <li><strong>10-19 LVL:</strong> Майстер звичок <em>(до 199)</em></li>
                        <li><strong>20+ LVL:</strong> Легенда <em>(від 200)</em></li>
                      </ul>
                      <p style={{marginTop: '10px', color: '#1dd1a1', fontSize: '0.8rem'}}>* Кожні 10 виконань звички = 1 Рівень</p>
                    </TooltipBox>
                  </TooltipContainer>
                </RankTitle>
                <ExpText style={{textAlign: 'left', marginTop: '5px'}}>Виконано звичок: {stats.totalCompletions}</ExpText>
              </div>
              <LevelBadge>{stats.level}</LevelBadge>
            </RankInfo>
            <ExpBarContainer>
              <ExpFill $percent={expPercentage} />
            </ExpBarContainer>
            <ExpText>До наступного рівня: {stats.expToNextLevel - stats.currentExp} виконань</ExpText>
          </StatsCard>
        )}

        <ProfileCard>
          <AvatarSection>
            <AvatarWrapper $isEditing={isEditing} onClick={() => isEditing && fileInputRef.current.click()}>
              <img src={formData.avatar} alt="Avatar" />
              <AvatarOverlay className="overlay">
                <FaCamera />
                <span>Змінити</span>
              </AvatarOverlay>
            </AvatarWrapper>
            <HiddenFileInput type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
            {isEditing && <FileHint>Максимальний розмір: 2MB (бажано квадратне фото)</FileHint>}
          </AvatarSection>

          <FormGroup>
            <Label>Ім'я користувача</Label>
            <Input 
              type="text" value={formData.username} 
              readOnly={!isEditing} $isEditing={isEditing}
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </FormGroup>

          <ActionRow>
            {isEditing ? (
              <>
                <EditButton $active onClick={() => { setIsEditing(false); setMessage({text:"", isError:false}) }}>
                  <FaTimes /> Скасувати
                </EditButton>
                <PrimaryButton onClick={handleSaveProfile} disabled={isLoading}>
                  <FaSave /> {isLoading ? "Збереження..." : "Зберегти"}
                </PrimaryButton>
              </>
            ) : (
              <EditButton onClick={() => setIsEditing(true)}>
                <FaEdit /> Редагувати профіль
              </EditButton>
            )}
          </ActionRow>

          {isEditing && (
            <SecuritySection>
              <SecurityNotice><FaShieldAlt /> Для зміни пошти або пароля потрібне підтвердження через поточну пошту.</SecurityNotice>
              
              <FormGroup>
                <Label>Поточна пошта (доступно лише для читання)</Label>
                <Input type="email" value={formData.email} readOnly $isEditing={false} />
              </FormGroup>

              <FormGroup>
                <Label>Нова пошта <FaEnvelope style={{color: '#1dd1a1'}}/></Label>
                <Input 
                  type="email" placeholder="Введіть нову пошту..." $isEditing={true}
                  value={securityData.newEmail} onChange={(e) => setSecurityData({...securityData, newEmail: e.target.value})} 
                />
              </FormGroup>

              <FormGroup>
                <Label>Новий пароль <FaLock style={{color: '#1dd1a1'}}/></Label>
                <Input 
                  type="password" placeholder="Мінімум 6 символів (літери та цифри)..." $isEditing={true}
                  value={securityData.newPassword} onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})} 
                />
              </FormGroup>

              <PrimaryButton onClick={requestSecurityChange} disabled={isLoading || (!securityData.newEmail && !securityData.newPassword)} style={{marginTop: '10px'}}>
                <FaShieldAlt /> Запросити зміну даних
              </PrimaryButton>
            </SecuritySection>
          )}
        </ProfileCard>
      </MainContainer>
    </PageWrapper>
  );
};

export default Profile;