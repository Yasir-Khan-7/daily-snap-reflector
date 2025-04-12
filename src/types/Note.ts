
export type NoteType = 'text' | 'task' | 'link';

export interface Note {
  id: string;
  content: string;
  type: NoteType;
  createdAt: Date;
  tags?: string[];
  completed?: boolean;
}
