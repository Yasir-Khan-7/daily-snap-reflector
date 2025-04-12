
export type NoteType = 'text' | 'task' | 'link' | 'image';

export interface Note {
  id: string;
  content: string;
  type: NoteType;
  createdAt: Date;
  tags?: string[];
  completed?: boolean;
  imageUrl?: string; // For image type notes
}
