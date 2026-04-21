import { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaPlus, FaTrash, FaStickyNote } from "react-icons/fa";
import {
  SidebarOverlay, SidebarContainer, SidebarHeader, NoteForm, NoteInput,
  NoteTextarea, AddNoteButton, NotesList, NoteCard, DeleteNoteBtn
} from "./NotesSidebar.styles";

const NotesSidebar = ({ isOpen, onClose, userToken }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const API_URL = "https://habit-tracker-wtyx.onrender.com/api/notes";

  const fetchNotes = async () => {
    if (!userToken) return;
    try {
      const res = await axios.get(API_URL, { headers: { "auth-token": userToken } });
      setNotes(res.data);
    } catch (err) { console.error("Помилка завантаження нотаток:", err); }
  };

  useEffect(() => { if (isOpen) fetchNotes(); }, [isOpen]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await axios.post(API_URL, { title, content }, { headers: { "auth-token": userToken } });
      setNotes([res.data, ...notes]);
      setTitle(""); setContent("");
    } catch (err) { console.error("Помилка створення нотатки:", err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { "auth-token": userToken } });
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) { console.error("Помилка видалення:", err); }
  };

  return (
    <>
      <SidebarOverlay $isOpen={isOpen} onClick={onClose} />
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <h2>Мої <span>Нотатки</span></h2>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
        </SidebarHeader>

        <NoteForm onSubmit={handleAddNote}>
          <NoteInput placeholder="Заголовок..." value={title} onChange={(e) => setTitle(e.target.value)} required />
          <NoteTextarea placeholder="Текст нотатки..." value={content} onChange={(e) => setContent(e.target.value)} required />
          <AddNoteButton type="submit"><FaPlus /> Додати</AddNoteButton>
        </NoteForm>

        <NotesList>
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.5 }}>Нотаток поки немає...</p>
          ) : (
            notes.map(note => (
              <NoteCard key={note._id}>
                <DeleteNoteBtn onClick={() => handleDelete(note._id)}><FaTrash /></DeleteNoteBtn>
                <h4>{note.title}</h4>
                <p>{note.content}</p>
              </NoteCard>
            ))
          )}
        </NotesList>
      </SidebarContainer>
    </>
  );
};

export default NotesSidebar;