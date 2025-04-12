
import React, { useState, useRef } from 'react';
import { Plus, Image } from 'lucide-react';
import { Note, NoteType } from '@/types/Note';
import { v4 as uuidv4 } from 'uuid';

interface NoteInputProps {
  onAddNote: (note: Note) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ onAddNote }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>('text');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNote = () => {
    if ((type === 'image' && imageFile) || (type !== 'image' && content.trim())) {
      const newNote: Note = {
        id: uuidv4(),
        content: type === 'image' ? imageFile?.name || 'Image' : content,
        type,
        createdAt: new Date(),
        completed: type === 'task' ? false : undefined,
        imageUrl: imagePreview || undefined
      };
      onAddNote(newNote);
      setContent('');
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex space-x-2">
        {(['text', 'task', 'link', 'image'] as NoteType[]).map((noteType) => (
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

      {type === 'image' ? (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
          >
            <Image className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-500">{imageFile ? imageFile.name : 'Click to upload an image'}</p>
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-48 rounded-md mx-auto"
              />
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Enter your ${type} here...`}
          className="w-full min-h-[100px] p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      )}

      <div className="flex justify-end">
        <button 
          onClick={handleAddNote}
          disabled={type === 'image' ? !imageFile : !content.trim()}
          className={`bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center transition-colors ${
            (type === 'image' ? !imageFile : !content.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'
          }`}
        >
          <Plus className="mr-2" size={20} />
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NoteInput;
