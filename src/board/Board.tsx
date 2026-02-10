import React, { useLayoutEffect, useReducer, useRef, useState } from "react";
import { boardReducer, makeInitialState } from "./boardReducer";
import { clampPos, minSize, rectsOverlap } from "./geometry";
import { NoteId, Rect, Size, Vec2 } from "./boardTypes";
import { Note } from "../note/Note";
import { Toolbar } from "../ui/Toolbar";
import { TrashZone } from "../ui/TrashZone";
import { loadState, saveState } from "./storage";
import { usePointerDrag } from "./usePointerDrag";

function getLocalPoint(e: React.PointerEvent, el: HTMLElement): Vec2 {
  const r = el.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

export const Board: React.FC = () => {
  const [state, dispatch] = useReducer(boardReducer, undefined, () => loadState() ?? makeInitialState());
  const boardRef = useRef<HTMLDivElement | null>(null);
  const trashRef = useRef<HTMLDivElement | null>(null);

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState<NoteId | null>(null);

  // Persist
  useLayoutEffect(() => {
    saveState(state);
  }, [state]);

  const drag = usePointerDrag({
    onMove: (id, pos) => {
      const n = state.notes[id];
      if (!n) return;
      const clamped = clampPos(pos, n.size, getBoardBounds(boardRef));
      dispatch({ type: "UPDATE_NOTE_POS", id, pos: clamped });
      updateTrashHover(id);
    },
    onResize: (id, size) => {
      const n = state.notes[id];
      if (!n) return;
      const bounded = minSize(size);
      const clampedPos = clampPos(n.pos, bounded, getBoardBounds(boardRef));
      dispatch({ type: "UPDATE_NOTE_SIZE", id, size: bounded });
      dispatch({ type: "UPDATE_NOTE_POS", id, pos: clampedPos });
      updateTrashHover(id);
    },
  });

  const getTrashRect = (): Rect | null => {
    const board = boardRef.current;
    const trash = trashRef.current;
    if (!board || !trash) return null;
    const br = board.getBoundingClientRect();
    const tr = trash.getBoundingClientRect();
    return { x: tr.left - br.left, y: tr.top - br.top, w: tr.width, h: tr.height };
  };

  const updateTrashHover = (id: NoteId) => {
    const n = state.notes[id];
    const t = getTrashRect();
    if (!n || !t) return;
    const noteRect: Rect = { x: n.pos.x, y: n.pos.y, w: n.size.w, h: n.size.h };
    setIsOverTrash(rectsOverlap(noteRect, t) ? id : null);
  };

  const onBoardPointerDown = (e: React.PointerEvent) => {
    if (!isCreateMode) return;
    const el = boardRef.current;
    if (!el) return;
    const p = getLocalPoint(e, el);
    dispatch({ type: "CREATE_NOTE", at: p, size: state.createPreset, color: state.createColor });
    setIsCreateMode(false);
  };

  const onNotePointerDownMove = (e: React.PointerEvent, id: NoteId) => {
    e.stopPropagation();
    const el = boardRef.current;
    if (!el) return;
    const n = state.notes[id];
    if (!n) return;

    dispatch({ type: "BRING_TO_FRONT", id });

    const p = getLocalPoint(e, el);
    drag.start({
      id,
      mode: "move",
      pointerId: e.pointerId,
      originPointer: p,
      originPos: n.pos,
      originSize: n.size,
    });

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onNotePointerDownResize = (e: React.PointerEvent, id: NoteId) => {
    e.stopPropagation();
    const el = boardRef.current;
    if (!el) return;
    const n = state.notes[id];
    if (!n) return;

    dispatch({ type: "BRING_TO_FRONT", id });

    const p = getLocalPoint(e, el);
    drag.start({
      id,
      mode: "resize",
      pointerId: e.pointerId,
      originPointer: p,
      originPos: n.pos,
      originSize: n.size,
    });

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = boardRef.current;
    if (!el) return;
    const p = getLocalPoint(e, el);
    drag.update(p);
  };

  const onPointerUp = () => {
    // If dropped over trash, delete
    if (isOverTrash) dispatch({ type: "DELETE_NOTE", id: isOverTrash });
    setIsOverTrash(null);
    drag.stop();
  };

  const notesSorted = state.order
    .map((id) => state.notes[id])
    .filter(Boolean)
    .sort((a, b) => a.z - b.z);

  return (
    <div className="appRoot">
      <Toolbar
        createPreset={state.createPreset}
        createColor={state.createColor}
        isCreateMode={isCreateMode}
        onToggleCreate={() => setIsCreateMode((v) => !v)}
        onPreset={(size) => dispatch({ type: "SET_CREATE_PRESET", size })}
        onColor={(color) => dispatch({ type: "SET_CREATE_COLOR", color })}
      />

      <div
        ref={boardRef}
        className={`board ${isCreateMode ? "createMode" : ""}`}
        onPointerDown={onBoardPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {notesSorted.map((n) => (
          <Note
            key={n.id}
            note={n}
            trashActive={isOverTrash === n.id}
            onMoveHandlePointerDown={(e) => onNotePointerDownMove(e, n.id)}
            onResizeHandlePointerDown={(e) => onNotePointerDownResize(e, n.id)}
            onTextChange={(text) => dispatch({ type: "UPDATE_NOTE_TEXT", id: n.id, text })}
            onFocus={() => dispatch({ type: "BRING_TO_FRONT", id: n.id })}
          />
        ))}

        <TrashZone ref={trashRef} active={isOverTrash != null} />
      </div>
    </div>
  );
};

function getBoardBounds(ref: React.RefObject<HTMLDivElement>): Size {
  const el = ref.current;
  if (!el) return { w: 1024, h: 768 };
  const r = el.getBoundingClientRect();
  return { w: r.width, h: r.height };
}