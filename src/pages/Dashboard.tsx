
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/SearchBar';
import NoteInput from '@/components/NoteInput';
import NoteList from '@/components/NoteList';
import { Note } from '@/types/Note';
import { Layout } from '@/components/ui/layout';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        const formattedNotes: Note[] = data.map(note => ({
          id: note.id,
          content: note.content,
          type: note.type as any,
          createdAt: new Date(note.created_at),
          completed: note.completed,
          imageUrl: note.image_url,
          tags: note.tags || []
        }));
        
        setNotes(formattedNotes);
        setFilteredNotes(formattedNotes);
      } catch (error: any) {
        toast({
          variant: "destructive", 
          title: "Error",
          description: "Failed to load notes: " + error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const handleAddNote = async (newNote: Note) => {
    if (!user) return;
    
    try {
      const noteData = {
        id: newNote.id,
        user_id: user.id,
        content: newNote.content,
        type: newNote.type,
        created_at: newNote.createdAt.toISOString(),
        completed: newNote.completed || false,
        image_url: newNote.imageUrl || null,
        tags: newNote.tags || []
      };
      
      const { error } = await supabase.from('notes').insert(noteData);
      
      if (error) {
        throw error;
      }
      
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add note: " + error.message,
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      
      if (error) {
        throw error;
      }
      
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete note: " + error.message,
      });
    }
  };

  const handleToggleTask = async (id: string) => {
    if (!user) return;
    
    try {
      // Find the note to toggle
      const noteToToggle = notes.find(note => note.id === id && note.type === 'task');
      
      if (!noteToToggle) return;
      
      const newCompletedState = !noteToToggle.completed;
      
      // Update the note in the database
      const { error } = await supabase
        .from('notes')
        .update({ completed: newCompletedState })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedNotes = notes.map(note => 
        note.id === id && note.type === 'task' 
          ? { ...note, completed: newCompletedState } 
          : note
      );
      
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
      
      toast({
        title: "Success",
        description: `Task marked as ${newCompletedState ? 'completed' : 'incomplete'}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task: " + error.message,
      });
    }
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
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Notes</h1>
          <p className="text-gray-600">Capture your thoughts before they fade away</p>
        </div>
        
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-8">
          <NoteInput onAddNote={handleAddNote} />
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <NoteList 
            notes={filteredNotes} 
            onDeleteNote={handleDeleteNote}
            onToggleTask={handleToggleTask}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No notes found. Add your first note above!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
