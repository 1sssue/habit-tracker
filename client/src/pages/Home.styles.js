import styled, { keyframes } from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  padding: 15px 12px 60px 12px;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (min-width: 768px) {
    padding: 40px 24px 80px 24px;
  }
`;

export const MainContainer = styled.div`
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* === НОВА ПАНЕЛЬ НАВІГАЦІЇ (НАВБАР) === */
export const HeaderBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.cardBg};
  padding: 12px 20px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.border};
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 600px) {
    padding: 16px;
    justify-content: center; /* Центруємо на мобільних */
  }
`;

export const Greeting = styled.h1`
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  
  span { color: #1dd1a1; }
  
  @media (min-width: 600px) { font-size: 1.8rem; }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`;

export const IconButton = styled.button`
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #1dd1a1;
    color: #1dd1a1;
    transform: translateY(-2px);
  }
`;

/* НОВА КНОПКА ПРОФІЛЮ З ФОТО */
export const ProfileAvatarBtn = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.bg};
  
  &:hover {
    border-color: #1dd1a1;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(29, 209, 161, 0.2);
  }

  img { width: 100%; height: 100%; object-fit: cover; }
`;

/* НОВА КОМПАКТНА КНОПКА ВИХОДУ */
export const LogoutBtn = styled.button`
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff6b6b;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
  }
`;

export const AICard = styled.div`
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.05) 0%, rgba(37, 117, 252, 0.05) 100%);
  border: 1px solid rgba(106, 17, 203, 0.2);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AITrigger = styled.button`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  height: 48px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(106, 17, 203, 0.25);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px rgba(106, 17, 203, 0.35);
  }
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

export const AIResponse = styled.div`
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${(props) => props.theme.text};
  padding: 16px;
  background: ${(props) => props.theme.cardBg};
  border-radius: 12px;
  border-left: 4px solid #6a11cb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

export const FormCard = styled.form`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.cardBg};
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid ${(props) => props.theme.border};
  overflow: hidden;
  transition: border-color 0.3s;

  &:focus-within {
    border-color: #1dd1a1;
  }
`;

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
`;

export const CleanInput = styled.input`
  border: none;
  background: transparent;
  color: ${(props) => props.theme.text};
  font-size: 1.15rem;
  font-weight: 600;
  width: 100%;

  &::placeholder {
    color: ${(props) => props.theme.textSec};
    opacity: 0.6;
    font-weight: 500;
  }
  &:focus { outline: none; }
`;

export const CleanTextarea = styled.textarea`
  border: none;
  background: transparent;
  color: ${(props) => props.theme.textSec};
  font-family: inherit;
  font-size: 0.95rem;
  width: 100%;
  resize: none;
  min-height: 40px;
  overflow-y: hidden;

  &::placeholder {
    color: ${(props) => props.theme.textSec};
    opacity: 0.5;
  }
  &:focus {
    outline: none;
    color: ${(props) => props.theme.text};
  }
`;

export const PrimaryButton = styled.button`
  background: #1dd1a1;
  color: white;
  border: none;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #10ac84;
    transform: translateY(-2px);
  }
`;

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  h2 {
    margin: 0;
    font-size: 1.3rem;
    color: ${(props) => props.theme.text};
  }
`;

export const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => props.theme.textSec};
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  font-weight: 600;
  cursor: pointer;
  outline: none;
`;

export const HabitsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HabitItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${(props) => props.theme.cardBg};
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border: 1px solid ${(props) => props.theme.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.$editing ? props.theme.border : '#1dd1a1'};
  }

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: ${(props) => props.$editing ? 'flex-start' : 'center'};
    justify-content: space-between;
    padding: 20px;
  }
`;

export const HabitContent = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    word-break: break-word;
  }
  .desc {
    margin: 4px 0 0 0;
    font-size: 0.9rem;
    color: ${(props) => props.theme.textSec};
    line-height: 1.4;
  }
  .streak {
    margin: 10px 0 0 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: #ff9f43;
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(255, 159, 67, 0.1);
    padding: 4px 10px;
    border-radius: 8px;
    width: fit-content;
  }
`;

export const HabitControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-end;
  width: 100%;
  justify-content: flex-end;

  @media (min-width: 600px) {
    align-self: center;
    width: auto;
  }
`;

export const ActionIconBtn = styled.button`
  background: ${(props) => props.$bg || 'transparent'};
  color: ${(props) => props.$color || props.theme.textSec};
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.$hoverBg || 'transparent'};
    color: ${(props) => props.$hoverColor || '#fff'};
    transform: scale(1.05);
  }
`;

export const popAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

export const CheckCircle = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$done ? 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' : 'transparent'};
  border: 3px solid ${(props) => props.$done ? 'transparent' : props.theme.border};
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${(props) => props.$done ? popAnimation : 'none'} 0.4s ease forwards;
  margin-left: auto;

  &:hover {
    border-color: #1dd1a1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(29, 209, 161, 0.2);
  }
  svg {
    opacity: ${(props) => props.$done ? 1 : 0};
    transform: scale(${(props) => props.$done ? 1 : 0});
    transition: all 0.3s ease;
  }
  @media (min-width: 600px) {
    margin-left: 10px;
    width: 48px;
    height: 48px;
    font-size: 1.4rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${(props) => props.theme.textSec};
  background: ${(props) => props.theme.cardBg};
  border-radius: 20px;
  border: 1px dashed ${(props) => props.theme.border};
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: ${(props) => props.theme.text};
  }
`;

export const IntervalSelect = styled.select`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
`;

export const ReminderWrapper = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid ${(props) => props.theme.border};
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

export const ReminderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReminderHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => props.theme.textSec};
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const TimeChipContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

export const TimeChip = styled.button`
  background: ${(props) => props.$active ? 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' : props.theme.bg};
  color: ${(props) => props.$active ? '#fff' : props.theme.textSec};
  border: 1px solid ${(props) => props.$active ? 'transparent' : props.theme.border};
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    transform: translateY(-2px);
    border-color: #1dd1a1;
    color: ${(props) => props.$active ? '#fff' : props.theme.text};
  }
`;

export const NativeTimeChip = styled.input`
  background: ${(props) => props.$active ? 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' : props.theme.bg};
  color: ${(props) => props.$active ? '#fff' : props.theme.textSec};
  border: 1px solid ${(props) => props.$active ? 'transparent' : props.theme.border};
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  height: 35px;
  outline: none;

  &:hover {
    border-color: #1dd1a1;
    color: ${(props) => props.$active ? '#fff' : props.theme.text};
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: ${(props) => props.$active ? 'brightness(0) invert(1)' : (props.theme.bg === '#0f172a' ? 'invert(1)' : 'none')};
  }
`;