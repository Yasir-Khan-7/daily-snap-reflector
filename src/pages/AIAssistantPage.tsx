import React from 'react';
import { Layout } from '@/components/ui/layout';
import AIAssistant from '@/components/AIAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { Note } from '@/types/Note';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AIAssistantPage: React.FC = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);

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
                    type: note.type,
                    createdAt: new Date(note.created_at),
                    completed: note.completed,
                    imageUrl: note.image_url,
                    tags: note.tags || []
                }));

                setNotes(formattedNotes);
            } catch (error: any) {
                console.error('Error fetching notes:', error.message);
            }
        };

        fetchNotes();
    }, [user]);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>
                        <AIAssistant notes={notes} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AIAssistantPage; 