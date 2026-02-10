import React, { useMemo } from "react";
import { NoteModel } from "../board/boardTypes";

export const Note: React.FC<{
  note: NoteModel;
  trashActive: boolean;
  onMoveHandlePointerDown: (e: React.PointerEvent) => void;
  onResizeHandlePointerDown: (e: React.PointerEvent) => void;
  onTextChange: (text: string) => void;
  onFocus: () => void;
}> = ({ note, trashActive, onMoveHandlePointerDown, onResizeHandlePointerDown, onTextChange, onFocus }) => {
  const style = useMemo<React.CSSProperties>(
    () => ({
      transform: `translate(${note.pos.x}px, ${note.pos.y}px)`,
      width: note.size.w,
      height: note.size.h,
      zIndex: note.z,
    }),
    [note.pos.x, note.pos.y, note.size.w, note.size.h, note.z]
  );

  return (
    <div className={`note ${note.color} ${trashActive ? "overTrash" : ""}`} style={style} onPointerDown={onFocus}>
      <div className="noteHeader" onPointerDown={onMoveHandlePointerDown} role="button" tabIndex={0}>
        <span className="noteGrip" aria-hidden="true">
          ⋮⋮
        </span>
        <span className="noteTitle">Note</span>
      </div>

      <textarea className="noteBody" value={note.text} onChange={(e) => onTextChange(e.target.value)} placeholder="Type..." />

      <div className="resizeHandle" onPointerDown={onResizeHandlePointerDown} role="button" tabIndex={0} />
    </div>
  );
};