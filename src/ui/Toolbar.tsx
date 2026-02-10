import React from "react";
import { NoteColor, Size } from "../board/boardTypes";

export const Toolbar: React.FC<{
  createPreset: Size;
  createColor: NoteColor;
  isCreateMode: boolean;
  onToggleCreate: () => void;
  onPreset: (s: Size) => void;
  onColor: (c: NoteColor) => void;
}> = ({ createPreset, createColor, isCreateMode, onToggleCreate, onPreset, onColor }) => {
  return (
    <div className="toolbar">
      <button className={isCreateMode ? "primary" : ""} onClick={onToggleCreate}>
        {isCreateMode ? "Click board to place…" : "New note"}
      </button>

      <div className="toolbarGroup">
        <span className="label">Size</span>
        <button onClick={() => onPreset({ w: 180, h: 140 })}>S</button>
        <button onClick={() => onPreset({ w: 220, h: 180 })}>M</button>
        <button onClick={() => onPreset({ w: 280, h: 220 })}>L</button>
        <span className="hint">
          {createPreset.w}×{createPreset.h}
        </span>
      </div>

      <div className="toolbarGroup">
        <span className="label">Color</span>
        {(["yellow", "pink", "blue", "green"] as const).map((c) => (
          <button key={c} className={createColor === c ? "selected" : ""} onClick={() => onColor(c)} aria-label={c}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};