
import React from 'react';
import { Note } from '@/types/Note';
import { Trash2, CheckCircle2, Circle, Link, FileText, Image } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onToggleTask?: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDeleteNote, onToggleTask }) => {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div 
          key={note.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-start space-x-4"
        >
          {note.type === 'task' && onToggleTask && (
            <button onClick={() => onToggleTask(note.id)} className="mt-1">
              {note.completed ? (
                <CheckCircle2 className="text-green-500" size={20} />
              ) : (
                <Circle className="text-gray-300" size={20} />
              )}
            </button>
          )}
          
          {note.type === 'text' && (
            <FileText className="text-blue-500 mt-1" size={20} />
          )}
          
          {note.type === 'link' && (
            <Link className="text-purple-500 mt-1" size={20} />
          )}
          
          {note.type === 'image' && (
            <Image className="text-green-500 mt-1" size={20} />
          )}
          
          <div className="flex-grow">
            <p 
              className={`text-gray-800 ${
                note.type === 'task' && note.completed 
                  ? 'line-through text-gray-400' 
                  : ''
              }`}
            >
              {note.content}
            </p>
            
            {note.type === 'image' && note.imageUrl && (
              <div className="mt-2">
                <img 
                  src={note.imageUrl} 
                  alt={note.content} 
                  className="max-h-64 rounded-md object-cover"
                />
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              {note.createdAt.toLocaleString()}
            </div>
          </div>
          <button 
            onClick={() => onDeleteNote(note.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
