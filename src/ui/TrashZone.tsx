import React, { forwardRef } from "react";

export const TrashZone = forwardRef<HTMLDivElement, { active: boolean }>(function TrashZone({ active }, ref) {
  return (
    <div ref={ref} className={`trash ${active ? "active" : ""}`}>
      🗑 Trash
    </div>
  );
});