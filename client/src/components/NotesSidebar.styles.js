import styled from "styled-components";

export const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
`;

export const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: ${(props) => props.theme.cardBg};
  border-left: 1px solid ${(props) => props.theme.border};
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transform: ${(props) => (props.$isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

export const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 1.5rem;
    margin: 0;
    span { color: #6a11cb; }
  }
`;

export const NoteForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

export const NoteInput = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  outline: none;
  &:focus { border-color: #6a11cb; }
`;

export const NoteTextarea = styled.textarea`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  font-size: 0.95rem;
  resize: none;
  min-height: 100px;
  outline: none;
  &:focus { border-color: #6a11cb; }
`;

export const AddNoteButton = styled.button`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  &:hover { transform: translateY(-2px); }
`;

export const NotesList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 5px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${(props) => props.theme.border}; border-radius: 10px; }
`;

export const NoteCard = styled.div`
  background: ${(props) => props.theme.bg};
  padding: 16px;
  border-radius: 14px;
  border: 1px solid ${(props) => props.theme.border};
  position: relative;
  transition: 0.2s;

  h4 { 
    margin: 0 0 8px 0; 
    font-size: 1.1rem; 
    color: #6a11cb; 
  }
  
  p { 
    margin: 0; 
    font-size: 0.9rem; 
    color: ${(props) => props.theme.textSec}; 
    line-height: 1.4; 
    
    /* === ОСЬ ЦІ ДВА РЯДКИ ВИРІШУЮТЬ ПРОБЛЕМУ === */
    white-space: pre-wrap; 
    word-break: break-word; 
  }
  
  &:hover { border-color: #6a11cb; }
`;

export const DeleteNoteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  color: ${(props) => props.theme.textSec};
  border: none;
  cursor: pointer;
  font-size: 1rem;
  &:hover { color: #ff6b6b; }
`;