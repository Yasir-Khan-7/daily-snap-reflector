import React, { useState, useRef } from 'react';
import { Plus, Image, FileText, CheckSquare, Link as LinkIcon, Tag, X, Sparkles } from 'lucide-react';
import { Note, NoteType } from '@/types/Note';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface NoteInputProps {
  onAddNote: (note: Note) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ onAddNote }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>('text');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
      setTagInput('');
      setIsExpanded(false);
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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const noteTypeIcons = {
    text: <FileText className="w-4 h-4" />,
    task: <CheckSquare className="w-4 h-4" />,
    link: <LinkIcon className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />
  };

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden bg-white">
      <CardContent className={`pt-4 ${isExpanded ? 'pb-4' : 'pb-0'}`}>
        {!isExpanded ? (
          <div 
            className="flex flex-col sm:flex-row items-center gap-3 p-2 cursor-pointer hover:bg-purple-50/50 transition-colors rounded-lg"
            onClick={() => setIsExpanded(true)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <Plus size={18} />
            </div>
            <p className="text-gray-500 font-medium mt-1 sm:mt-0">What's on your mind?</p>
            <div className="mt-1 sm:mt-0 sm:ml-auto w-full sm:w-auto flex justify-center sm:justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 w-full sm:w-auto"
              >
                <Sparkles size={16} className="mr-1" />
                Capture Moment
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Create New Note</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="rounded-full hover:bg-purple-100 hover:text-purple-700"
              >
                <X size={18} />
              </Button>
            </div>
            
            <Tabs
              defaultValue="text"
              value={type}
              onValueChange={(value) => setType(value as NoteType)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4 p-1 bg-purple-50 rounded-lg">
                {(['text', 'task', 'link', 'image'] as NoteType[]).map((noteType) => (
                  <TabsTrigger 
                    key={noteType} 
                    value={noteType} 
                    className="flex items-center justify-center gap-1 rounded-md data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow transition-all py-1.5 px-1.5"
                  >
                    <span className="transition-transform group-hover:scale-110">{noteTypeIcons[noteType]}</span>
                    <span className="sm:inline hidden">{noteType.charAt(0).toUpperCase() + noteType.slice(1)}</span>
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
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all group"
                  >
                    <Image className="mx-auto mb-3 text-gray-400 group-hover:text-purple-500 transition-colors" size={36} />
                    <p className="text-gray-500 group-hover:text-purple-600 transition-colors">
                      {imageFile ? imageFile.name : 'Click to upload an image'}
                    </p>
                  </div>
                  {imagePreview && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2"
                    >
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="rounded-lg mx-auto max-h-48 border border-purple-200 shadow-sm group-hover:shadow-md transition-all"
                        />
                        <button 
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="text">
                <div className="space-y-3">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="min-h-[120px] resize-none rounded-lg border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                  />
                </div>
              </TabsContent>

              <TabsContent value="task">
                <div className="space-y-3">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What needs to be done?"
                    className="min-h-[120px] resize-none rounded-lg border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                  />
                </div>
              </TabsContent>

              <TabsContent value="link">
                <div className="space-y-3">
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter URL here..."
                    type="url"
                    className="rounded-lg border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                  />
                  <Textarea
                    placeholder="Add description (optional)"
                    className="min-h-[80px] resize-none rounded-lg border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 space-y-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tag-input" className="flex items-center text-sm font-medium text-gray-600">
                  <Tag className="h-4 w-4 mr-1" />
                  Tags:
                </Label>
                <div className="w-full">
                  <Input
                    id="tag-input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tags (press Enter)"
                    className="rounded-lg border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                  />
                </div>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors flex items-center gap-1 text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-purple-700 hover:text-purple-900 focus:outline-none rounded-full hover:bg-purple-200 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setContent('');
                  setImageFile(null);
                  setImagePreview(null);
                  setTags([]);
                  setTagInput('');
                  setIsExpanded(false);
                }}
                className="w-full sm:w-auto text-gray-600 hover:text-gray-800 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                disabled={(type === 'image' && !imageFile) || (type !== 'image' && !content.trim())}
                onClick={handleAddNote}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white order-1 sm:order-2"
              >
                Add {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteInput;
