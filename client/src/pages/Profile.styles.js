import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 15px 80px 15px;
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 40px 24px;
  }
`;

export const MainContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const HeaderBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const BackBtn = styled.button`
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.textSec};
  border: 1px solid ${(props) => props.theme.border};
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: #1dd1a1;
    border-color: #1dd1a1;
    transform: translateX(-3px);
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;

  span {
    color: #1dd1a1;
  }
`;

export const StatsCard = styled.div`
  background: linear-gradient(135deg, rgba(29, 209, 161, 0.1) 0%, rgba(16, 172, 132, 0.1) 100%);
  border: 1px solid rgba(29, 209, 161, 0.3);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const RankInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const RankTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  color: ${(props) => props.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #1dd1a1;
    font-size: 0.9rem;
    background: rgba(29, 209, 161, 0.2);
    padding: 4px 10px;
    border-radius: 8px;
  }
`;

export const LevelBadge = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #1dd1a1;
  line-height: 1;
`;

export const ExpBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(29, 209, 161, 0.2);
`;

export const ExpFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1dd1a1 0%, #10ac84 100%);
  width: ${(props) => props.$percent}%;
  transition: width 1s ease-in-out;
`;

export const ExpText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${(props) => props.theme.textSec};
  text-align: right;
`;

export const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: help;
  color: ${(props) => props.theme.textSec};
  font-size: 1rem;

  &:hover .tooltip-box {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0); /* Плавне опускання */
  }
`;

export const TooltipBox = styled.div`
  visibility: hidden;
  position: absolute;
  top: calc(100% + 12px); /* ТЕПЕР З'ЯВЛЯЄТЬСЯ ЗНИЗУ */
  left: 50%;
  transform: translateX(-50%) translateY(-10px); /* Початкова позиція для анімації */
  width: 260px;
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 15px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 100;
  font-size: 0.85rem;
  line-height: 1.5;

  h4 {
    margin: 0 0 10px 0;
    color: #1dd1a1;
    font-size: 0.95rem;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 6px;
    strong { color: ${(props) => props.theme.text}; }
  }

  /* Основний колір стрілочки (перевернуто вгору) */
  &::after {
    content: '';
    position: absolute;
    bottom: 100%; /* Притискаємо до верху підказки */
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent ${(props) => props.theme.cardBg} transparent;
  }

  /* Рамка для стрілочки, щоб вона ідеально зливалася з бордером картки */
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -7px;
    border-width: 7px;
    border-style: solid;
    border-color: transparent transparent ${(props) => props.theme.border} transparent;
  }
`;

export const ProfileCard = styled.div`
  background: ${(props) => props.theme.cardBg};
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid ${(props) => props.theme.border};
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const AvatarWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid ${(props) => props.$isEditing ? '#1dd1a1' : props.theme.border};
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
  cursor: ${(props) => props.$isEditing ? 'pointer' : 'default'};

  &:hover .overlay {
    opacity: ${(props) => props.$isEditing ? 1 : 0};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  opacity: 0;
  transition: 0.3s;

  svg {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileHint = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #ff9f43;
  background: rgba(255, 159, 67, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  text-align: center;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.textSec};
  display: flex;
  justify-content: space-between;
`;

export const Input = styled.input`
  padding: 14px 16px;
  border-radius: 12px;
  border: 2px solid ${(props) => props.$isEditing ? props.theme.border : 'transparent'};
  background: ${(props) => props.$isEditing ? props.theme.bg : 'rgba(150, 150, 150, 0.05)'};
  color: ${(props) => props.theme.text};
  font-size: 1.05rem;
  font-weight: 500;
  transition: all 0.2s;
  outline: none;
  opacity: ${(props) => props.$isEditing ? 1 : 0.8};

  &:focus {
    border-color: ${(props) => props.$isEditing ? '#1dd1a1' : 'transparent'};
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(29, 209, 161, 0.3);
  }
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

export const EditButton = styled.button`
  background: transparent;
  color: ${(props) => props.$active ? '#ff6b6b' : props.theme.text};
  border: 1px solid ${(props) => props.$active ? '#ff6b6b' : props.theme.border};
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 150px;

  &:hover {
    border-color: ${(props) => props.$active ? '#ff4757' : '#1dd1a1'};
    color: ${(props) => props.$active ? '#ff4757' : '#1dd1a1'};
  }
`;

export const SecuritySection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed ${(props) => props.theme.border};
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SecurityNotice = styled.p`
  font-size: 0.85rem;
  color: #ff9f43;
  margin: 0;
  background: rgba(255, 159, 67, 0.1);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MessageText = styled.div`
  background: ${(props) => props.$error ? 'rgba(255, 107, 107, 0.1)' : 'rgba(29, 209, 161, 0.1)'};
  color: ${(props) => props.$error ? '#ff6b6b' : '#1dd1a1'};
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 10px;
  border: 1px solid ${(props) => props.$error ? 'rgba(255, 107, 107, 0.3)' : 'rgba(29, 209, 161, 0.3)'};
`;