
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import NoteInput from '@/components/NoteInput';
import NoteList from '@/components/NoteList';
import { Note } from '@/types/Note';

const Index: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const handleAddNote = (newNote: Note) => {
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
  };

  const handleToggleTask = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id && note.type === 'task' 
        ? { ...note, completed: !note.completed } 
        : note
    );
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredNotes(notes);
      return;
    }
    
    const filtered = notes.filter(note => 
      note.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  return (
    <div className="min-h-screen bg-soft-gray p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-dark-gray mb-4">Daily Snap</h1>
        <p className="text-lg text-neutral-gray">Capture your thoughts before they fade away</p>
      </div>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-8">
        <NoteInput onAddNote={handleAddNote} />
      </div>

      <NoteList 
        notes={filteredNotes} 
        onDeleteNote={handleDeleteNote}
        onToggleTask={handleToggleTask}
      />
    </div>
  );
};

export default Index;
