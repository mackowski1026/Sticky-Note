export type NoteId = string;

export type NoteColor = "yellow" | "pink" | "blue" | "green";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Rect extends Vec2, Size {}

export interface NoteModel {
  id: NoteId;
  pos: Vec2;
  size: Size;
  z: number;
  color: NoteColor;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface BoardState {
  notes: Record<NoteId, NoteModel>;
  order: NoteId[];
  nextZ: number;
  createPreset: Size;
  createColor: NoteColor;
}

export type DragMode = "move" | "resize";