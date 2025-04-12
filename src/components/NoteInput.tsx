
import React, { useState, useRef } from 'react';
import { Plus, Image, FileText, CheckSquare, Link as LinkIcon } from 'lucide-react';
import { Note, NoteType } from '@/types/Note';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import AIAssistant from '@/components/AIAssistant';

interface NoteInputProps {
  onAddNote: (note: Note) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ onAddNote }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>('text');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNote = () => {
    if ((type === 'image' && imageFile) || (type !== 'image' && content.trim())) {
      const newNote: Note = {
        id: uuidv4(),
        content: type === 'image' ? imageFile?.name || 'Image' : content,
        type,
        createdAt: new Date(),
        completed: type === 'task' ? false : undefined,
        imageUrl: imagePreview || undefined,
        tags: tags.length > 0 ? tags : undefined
      };
      onAddNote(newNote);
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      setTags([]);
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

  const handleApplyAIContent = (aiContent: string) => {
    setContent(aiContent);
  };

  const handleAddTags = (newTags: string[]) => {
    setTags([...new Set([...tags, ...newTags])]);
  };

  const noteTypeIcons = {
    text: <FileText className="w-4 h-4" />,
    task: <CheckSquare className="w-4 h-4" />,
    link: <LinkIcon className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <Tabs 
          defaultValue="text" 
          value={type} 
          onValueChange={(value) => setType(value as NoteType)} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            {(['text', 'task', 'link', 'image'] as NoteType[]).map((noteType) => (
              <TabsTrigger key={noteType} value={noteType} className="flex items-center gap-2">
                {noteTypeIcons[noteType]}
                {noteType.charAt(0).toUpperCase() + noteType.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="image">
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
          </TabsContent>
          
          <TabsContent value="text">
            <div className="space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-[120px] resize-none"
              />
              {content && type === 'text' && <AIAssistant content={content} onApply={handleApplyAIContent} onAddTags={handleAddTags} />}
            </div>
          </TabsContent>
          
          <TabsContent value="task">
            <div className="space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What needs to be done?"
                className="min-h-[120px] resize-none"
              />
              {content && type === 'task' && <AIAssistant content={content} onApply={handleApplyAIContent} onAddTags={handleAddTags} />}
            </div>
          </TabsContent>
          
          <TabsContent value="link">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter URL here..."
              type="url"
              className="mb-4"
            />
            <Textarea
              placeholder="Add description (optional)"
              className="min-h-[80px] resize-none"
            />
          </TabsContent>
        </Tabs>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {tags.map((tag, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleAddNote}
            disabled={type === 'image' ? !imageFile : !content.trim()}
            className="gap-2"
          >
            <Plus size={18} />
            Add Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteInput;
