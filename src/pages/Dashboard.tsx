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
import { X, BarChart3, FileText, Settings } from 'lucide-react';
import TabView from '@/components/ui/tabs-view';

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
    <>
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {allTags.length > 0 && (
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Filter by tags:</div>
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
            {(activeTags.length > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs flex items-center gap-1"
              >
                <X size={14} /> Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

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
    </>
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
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="py-6">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <p className="text-muted-foreground">Settings panel is under development.</p>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-6">
        <div className="mb-6 px-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and analyze your daily notes and tasks</p>
        </div>

        <TabView tabs={dashboardTabs} defaultValue="analytics" />
      </div>
    </Layout>
  );
};

export default Dashboard;
