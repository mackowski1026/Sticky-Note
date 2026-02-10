import { BoardState, NoteId, NoteModel, Size, Vec2, NoteColor } from "./boardTypes";

export type BoardAction =
  | { type: "CREATE_NOTE"; at: Vec2; size: Size; color: NoteColor }
  | { type: "UPDATE_NOTE_POS"; id: NoteId; pos: Vec2 }
  | { type: "UPDATE_NOTE_SIZE"; id: NoteId; size: Size }
  | { type: "UPDATE_NOTE_TEXT"; id: NoteId; text: string }
  | { type: "BRING_TO_FRONT"; id: NoteId }
  | { type: "DELETE_NOTE"; id: NoteId }
  | { type: "SET_CREATE_PRESET"; size: Size }
  | { type: "SET_CREATE_COLOR"; color: NoteColor }
  | { type: "HYDRATE"; state: BoardState };

const now = () => Date.now();
const id = () => (typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()));

export function makeInitialState(): BoardState {
  return {
    notes: {},
    order: [],
    nextZ: 1,
    createPreset: { w: 220, h: 180 },
    createColor: "yellow",
  };
}

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "SET_CREATE_PRESET":
      return { ...state, createPreset: action.size };

    case "SET_CREATE_COLOR":
      return { ...state, createColor: action.color };

    case "CREATE_NOTE": {
      const noteId = id();
      const t = now();
      const note: NoteModel = {
        id: noteId,
        pos: action.at,
        size: action.size,
        z: state.nextZ,
        color: action.color,
        text: "",
        createdAt: t,
        updatedAt: t,
      };
      return {
        ...state,
        notes: { ...state.notes, [noteId]: note },
        order: [...state.order, noteId],
        nextZ: state.nextZ + 1,
      };
    }

    case "BRING_TO_FRONT": {
      const n = state.notes[action.id];
      if (!n) return state;
      const updated: NoteModel = { ...n, z: state.nextZ, updatedAt: now() };
      return {
        ...state,
        notes: { ...state.notes, [action.id]: updated },
        nextZ: state.nextZ + 1,
      };
    }

    case "UPDATE_NOTE_POS": {
      const n = state.notes[action.id];
      if (!n) return state;
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: { ...n, pos: action.pos, updatedAt: now() },
        },
      };
    }

    case "UPDATE_NOTE_SIZE": {
      const n = state.notes[action.id];
      if (!n) return state;
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: { ...n, size: action.size, updatedAt: now() },
        },
      };
    }

    case "UPDATE_NOTE_TEXT": {
      const n = state.notes[action.id];
      if (!n) return state;
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: { ...n, text: action.text, updatedAt: now() },
        },
      };
    }

    case "DELETE_NOTE": {
      if (!state.notes[action.id]) return state;
      const notesCopy = { ...state.notes };
      delete notesCopy[action.id];
      return {
        ...state,
        notes: notesCopy,
        order: state.order.filter((x) => x !== action.id),
      };
    }

    default:
      return state;
  }
}