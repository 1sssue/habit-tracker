import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from "react-icons/fa";

const PageWrapper = styled.div`
  min-height: 100vh; width: 100%; background-color: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text};
  display: flex; justify-content: center; padding: 20px 12px 60px 12px; transition: all 0.3s ease;
  @media (min-width: 768px) { padding: 40px 24px 80px 24px; }
`;

const MainContainer = styled.div` width: 100%; max-width: 768px; display: flex; flex-direction: column; gap: 24px; `;

const HeaderBar = styled.header` display: flex; align-items: center; gap: 15px; `;
const BackBtn = styled(Link)`
  background: ${(props) => props.theme.cardBg}; color: ${(props) => props.theme.text}; border: 1px solid ${(props) => props.theme.border};
  width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: 0.2s;
  &:hover { transform: translateX(-3px); border-color: #1dd1a1; }
`;

const Title = styled.h1` font-size: 1.8rem; font-weight: 800; margin: 0; span { color: #1dd1a1; } `;

const Card = styled.div`
  background: ${(props) => props.theme.cardBg}; border-radius: 20px; padding: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid ${(props) => props.theme.border};
`;

const SectionTitle = styled.h2` font-size: 1.3rem; margin: 0 0 20px 0; color: ${(props) => props.theme.text}; border-bottom: 2px solid ${(props) => props.theme.border}; padding-bottom: 10px; `;

const Form = styled.form` display: flex; flex-direction: column; gap: 15px; `;

const Input = styled.input`
  padding: 14px; border-radius: 12px; border: 2px solid ${(props) => props.theme.border}; background: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; font-size: 1rem; transition: 0.2s;
  &:focus { border-color: #1dd1a1; }
`;

const Textarea = styled.textarea`
  padding: 14px; border-radius: 12px; border: 2px solid ${(props) => props.theme.border}; background: ${(props) => props.theme.bg}; color: ${(props) => props.theme.text}; font-family: inherit; resize: none; min-height: 100px; transition: 0.2s;
  &:focus { border-color: #ff9f43; }
`;

const PrimaryBtn = styled.button`
  background: #1dd1a1; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s;
  &:hover { background: #10ac84; transform: translateY(-2px); }
`;

const NotesGrid = styled.div` display: grid; grid-template-columns: 1fr; gap: 15px; margin-top: 20px; @media (min-width: 600px) { grid-template-columns: 1fr 1fr; } `;

const NoteSticker = styled.div`
  background: rgba(255, 159, 67, 0.1); border: 1px solid rgba(255, 159, 67, 0.3); border-radius: 16px; padding: 16px; position: relative; color: ${(props) => props.theme.text}; line-height: 1.5; font-size: 0.95rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 120px;
`;

const DeleteNoteBtn = styled.button`
  background: transparent; border: none; color: #ff6b6b; cursor: pointer; align-self: flex-end; margin-top: 10px; font-size: 1.1rem; transition: 0.2s;
  &:hover { transform: scale(1.1); }
`;

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => { const saved = localStorage.getItem("user"); return saved ? JSON.parse(saved) : null; });
  
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const API_URL = "https://habit-tracker-wtyx.onrender.com/api";

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`, { headers: { "auth-token": user.token } });
      setNotes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/users/update`, { username, email }, { headers: { "auth-token": user.token } });
      const updatedUser = { ...user, username: res.data.username, email: res.data.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Дані успішно оновлено! 🎉");
    } catch (err) { alert("Помилка оновлення даних."); }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/notes`, { text: newNote }, { headers: { "auth-token": user.token } });
      setNotes([res.data, ...notes]);
      setNewNote("");
    } catch (err) { alert("Помилка створення замітки"); }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`, { headers: { "auth-token": user.token } });
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) { console.error(err); }
  };

  if (!user) return null;

  return (
    <PageWrapper>
      <MainContainer>
        <HeaderBar>
          <BackBtn to="/"><FaArrowLeft /></BackBtn>
          <Title>Твій <span>Профіль</span></Title>
        </HeaderBar>

        <Card>
          <SectionTitle>Особисті дані</SectionTitle>
          <Form onSubmit={handleUpdateProfile}>
            <Input type="text" placeholder="Ім'я" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <PrimaryBtn type="submit"><FaSave /> Зберегти зміни</PrimaryBtn>
          </Form>
        </Card>

        <Card>
          <SectionTitle>Мої замітки (Стікери)</SectionTitle>
          <Form onSubmit={handleAddNote}>
            <Textarea placeholder="Запиши сюди думку, ідею чи інсайт..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            <PrimaryBtn type="submit" style={{ background: '#ff9f43' }}><FaPlus /> Додати стікер</PrimaryBtn>
          </Form>

          <NotesGrid>
            {notes.map(note => (
              <NoteSticker key={note._id}>
                <div>{note.text}</div>
                <DeleteNoteBtn onClick={() => handleDeleteNote(note._id)}><FaTrash /></DeleteNoteBtn>
              </NoteSticker>
            ))}
          </NotesGrid>
        </Card>

      </MainContainer>
    </PageWrapper>
  );
};

export default Profile;