
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Note, NoteType } from '@/types/Note';
import { v4 as uuidv4 } from 'uuid';

interface NoteInputProps {
  onAddNote: (note: Note) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ onAddNote }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>('text');

  const handleAddNote = () => {
    if (content.trim()) {
      const newNote: Note = {
        id: uuidv4(),
        content,
        type,
        createdAt: new Date(),
        completed: type === 'task' ? false : undefined
      };
      onAddNote(newNote);
      setContent('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex space-x-2">
        {(['text', 'task', 'link'] as NoteType[]).map((noteType) => (
          <button
            key={noteType}
            onClick={() => setType(noteType)}
            className={`px-3 py-1 rounded-full text-sm ${
              type === noteType 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {noteType.charAt(0).toUpperCase() + noteType.slice(1)}
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Enter your ${type} here...`}
        className="w-full min-h-[100px] p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
      <div className="flex justify-end">
        <button 
          onClick={handleAddNote}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-600 transition-colors"
        >
          <Plus className="mr-2" size={20} />
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NoteInput;
