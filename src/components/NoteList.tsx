import React from 'react';
import { Note } from '@/types/Note';
import { Trash2, CheckCircle2, Circle, Link, FileText, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onToggleTask: (id: string, completed: boolean) => void;
  onTagClick: (tag: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDeleteNote, onToggleTask, onTagClick }) => {
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      onDeleteNote(id);
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
    try {
      const { error } = await supabase
        .from('notes')
        .update({ completed })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      onToggleTask(id, completed);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status: " + error.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start p-4">
              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-gray-100">
                {note.type === 'task' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleTask(note.id, !note.completed)}
                    className="p-0 h-auto w-auto hover:bg-transparent"
                  >
                    {note.completed ? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : (
                      <Circle className="text-gray-400" size={20} />
                    )}
                  </Button>
                )}
                
                {note.type === 'text' && (
                  <FileText className="text-blue-500" size={20} />
                )}
                
                {note.type === 'link' && (
                  <Link className="text-purple-500" size={20} />
                )}
                
                {note.type === 'image' && (
                  <Image className="text-green-500" size={20} />
                )}
              </div>
              
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
                
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {note.type === 'image' && note.imageUrl && (
                  <div className="mt-3">
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
              
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => handleDelete(note.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={18} />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NoteList;
