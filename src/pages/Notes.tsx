import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/SearchBar';
import NoteInput from '@/components/NoteInput';
import NoteList from '@/components/NoteList';
import { Note } from '@/types/Note';
import { Layout } from '@/components/ui/layout';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, FileText, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Notes: React.FC = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [activeType, setActiveType] = useState<string | null>(null);

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
        // Apply filters
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

        // Apply type filter
        if (activeType) {
            filtered = filtered.filter(note => note.type === activeType);
        }

        setFilteredNotes(filtered);
    }, [searchQuery, activeTags, activeType, notes]);

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

    const handleToggleTask = async (id: string, completed: boolean) => {
        if (!user) return;

        try {
            // Update the note in the database
            const { error } = await supabase
                .from('notes')
                .update({ completed })
                .eq('id', id);

            if (error) {
                throw error;
            }

            // Update local state
            const updatedNotes = notes.map(note =>
                note.id === id
                    ? { ...note, completed }
                    : note
            );

            setNotes(updatedNotes);
            setFilteredNotes(updatedNotes);

            toast({
                title: "Success",
                description: `Task marked as ${completed ? 'completed' : 'incomplete'}`,
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

    const toggleType = (type: string) => {
        setActiveType(currentType =>
            currentType === type ? null : type
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setActiveTags([]);
        setActiveType(null);
    };

    // Count notes by type
    const textNotesCount = notes.filter(note => note.type === 'text').length;
    const taskNotesCount = notes.filter(note => note.type === 'task').length;
    const linkNotesCount = notes.filter(note => note.type === 'link').length;
    const imageNotesCount = notes.filter(note => note.type === 'image').length;

    const handleTagClick = (tag: string) => {
        toggleTag(tag);
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Notes</h1>
                        <p className="text-gray-600 mt-1">Browse and manage all your captured thoughts</p>
                    </div>
                </div>

                {/* Note Input Section */}
                <Card className="mb-8 border-purple-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-2">
                        <CardTitle className="text-xl">Create New Note</CardTitle>
                        <CardDescription>Capture your thoughts, tasks, links, or images</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <NoteInput 
                            onAddNote={(note: Note) => {
                                // Add note to Supabase
                                const saveNoteToDatabase = async (noteData: Note) => {
                                    if (!user) return;
                                    
                                    try {
                                        const { error } = await supabase
                                            .from('notes')
                                            .insert({
                                                id: noteData.id,
                                                content: noteData.content,
                                                type: noteData.type,
                                                created_at: noteData.createdAt.toISOString(),
                                                completed: noteData.completed || false,
                                                image_url: noteData.imageUrl || null,
                                                tags: noteData.tags || [],
                                                user_id: user.id
                                            });
                                            
                                        if (error) {
                                            throw error;
                                        }
                                        
                                        // Update local state after successful save to DB
                                        setNotes([noteData, ...notes]);
                                        setFilteredNotes([noteData, ...filteredNotes]);
                                        
                                        // Update tags if new ones are added
                                        if (noteData.tags && noteData.tags.length > 0) {
                                            const newTags = noteData.tags.filter(tag => !allTags.includes(tag));
                                            if (newTags.length > 0) {
                                                setAllTags([...allTags, ...newTags]);
                                            }
                                        }
                                        
                                        toast({
                                            title: "Success",
                                            description: "Note added successfully",
                                        });
                                    } catch (error: any) {
                                        toast({
                                            variant: "destructive",
                                            title: "Error",
                                            description: "Failed to save note: " + error.message,
                                        });
                                    }
                                };
                                
                                saveNoteToDatabase(note);
                            }} 
                        />
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${activeType === 'text' ? 'bg-purple-50 border-purple-200' : ''}`}
                        onClick={() => toggleType('text')}
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <FileText className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Text Notes</p>
                                    <p className="text-muted-foreground text-sm">{textNotesCount} notes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${activeType === 'task' ? 'bg-green-50 border-green-200' : ''}`}
                        onClick={() => toggleType('task')}
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Tasks</p>
                                    <p className="text-muted-foreground text-sm">{taskNotesCount} tasks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${activeType === 'link' ? 'bg-blue-50 border-blue-200' : ''}`}
                        onClick={() => toggleType('link')}
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Links</p>
                                    <p className="text-muted-foreground text-sm">{linkNotesCount} links</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all hover:shadow-md ${activeType === 'image' ? 'bg-amber-50 border-amber-200' : ''}`}
                        onClick={() => toggleType('image')}
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100 p-2 rounded-lg">
                                    <FileText className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Images</p>
                                    <p className="text-muted-foreground text-sm">{imageNotesCount} images</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {allTags.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <Filter className="h-4 w-4 text-gray-500 mr-2" />
                            <p className="text-sm text-gray-500">Filter by tags:</p>
                        </div>
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
                            {(activeTags.length > 0 || searchQuery || activeType) && (
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

                {loading ? (
                    <div className="flex justify-center my-12">
                        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : filteredNotes.length > 0 ? (
                    <NoteList
                        notes={filteredNotes}
                        onDeleteNote={handleDeleteNote}
                        onToggleTask={handleToggleTask}
                        onTagClick={handleTagClick}
                    />
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No notes found with the current filters.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Notes; 