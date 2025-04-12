import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/SearchBar';
import NoteInput from '@/components/NoteInput';
import NoteList from '@/components/NoteList';
import Analytics from '@/components/Analytics';
import { Note } from '@/types/Note';
import { Layout } from '@/components/ui/layout';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, BarChart3, FileText, CalendarClock, ListTodo, Plus, Filter } from 'lucide-react';
import TabView from '@/components/ui/tabs-view';
import PomodoroTimer from '@/components/PomodoroTimer';
import HabitTracker from '@/components/HabitTracker';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

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

        // Extract all unique tags
        const tagsSet = new Set<string>();
        formattedNotes.forEach(note => {
          if (note.tags) {
            note.tags.forEach(tag => tagsSet.add(tag));
          }
        });
        setAllTags(Array.from(tagsSet));
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

  useEffect(() => {
    // Apply both search and tag filters
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(note =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tag filter
    if (activeTags.length > 0) {
      filtered = filtered.filter(note =>
        note.tags && activeTags.some(tag => note.tags!.includes(tag))
      );
    }

    setFilteredNotes(filtered);
  }, [searchQuery, activeTags, notes]);

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

      // Update all tags
      if (newNote.tags && newNote.tags.length > 0) {
        const updatedTags = [...allTags];
        newNote.tags.forEach(tag => {
          if (!updatedTags.includes(tag)) {
            updatedTags.push(tag);
          }
        });
        setAllTags(updatedTags);
      }

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
    setSearchQuery(query);
  };

  const toggleTag = (tag: string) => {
    setActiveTags(currentTags =>
      currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTags([]);
  };

  // Define tab content components
  const NotesTabContent = () => (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-2/3">
          <SearchBar onSearch={handleSearch} />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => document.getElementById('tags-filter')?.classList.toggle('hidden')}
            >
              <Filter className="h-4 w-4" />
              Filter by Tags
            </Button>

            {(activeTags.length > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs flex items-center gap-1"
              >
                <X size={14} /> Clear
              </Button>
            )}
          </div>
        )}
      </div>

      <div id="tags-filter" className="mb-6 hidden">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium mb-3">Available Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
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
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-600">No notes found. Add your first note above!</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={() => document.getElementById('tag-input')?.focus()}>
            <Plus size={16} />
            Add Note
          </Button>
        </div>
      )}
    </div>
  );

  // Define the tabs configuration
  const dashboardTabs = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      content: <Analytics notes={notes} />
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <FileText className="h-4 w-4" />,
      content: <NotesTabContent />
    },
    {
      id: 'productivity',
      label: 'Productivity',
      icon: <CalendarClock className="h-4 w-4" />,
      content: (
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4 text-gray-800 flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-purple-500" />
                Pomodoro Timer
              </h2>
              <PomodoroTimer />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-4 text-gray-800 flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-green-500" />
                Habit Tracker
              </h2>
              <HabitTracker />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <ListTodo className="h-4 w-4" />,
      content: (
        <div className="container mx-auto max-w-5xl px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-green-500" />
              Task Manager
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {notes.filter(note => note.type === 'task' && note.completed).length} Completed
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {notes.filter(note => note.type === 'task' && !note.completed).length} Pending
              </Badge>
            </div>
          </div>

          <NoteList
            notes={notes.filter(note => note.type === 'task')}
            onDeleteNote={handleDeleteNote}
            onToggleTask={handleToggleTask}
          />

          {notes.filter(note => note.type === 'task').length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-600">No tasks found. Create a new task using the Notes tab.</p>
              <Button variant="outline" className="mt-4 gap-2" onClick={() => document.getElementById('tasks-tab')?.click()}>
                <Plus size={16} />
                Add Task
              </Button>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-purple-50 to-transparent pt-8 pb-4">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and analyze your notes, tasks, and productivity</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-4">
        <TabView tabs={dashboardTabs} defaultValue="analytics" />
      </div>
    </Layout>
  );
};

export default Dashboard;
