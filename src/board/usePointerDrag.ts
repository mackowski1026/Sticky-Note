import { useEffect, useRef } from "react";
import { DragMode, Size, Vec2 } from "./boardTypes";

type DragSession =
  | {
      id: string;
      mode: DragMode;
      pointerId: number;
      originPointer: Vec2;
      originPos: Vec2;
      originSize: Size;
    }
  | null;

export function usePointerDrag(params: {
  onMove: (id: string, pos: Vec2) => void;
  onResize: (id: string, size: Size) => void;
}) {
  const sessionRef = useRef<DragSession>(null);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<(() => void) | null>(null);

  const schedule = (fn: () => void) => {
    pendingRef.current = fn;
    if (frameRef.current != null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      pendingRef.current?.();
      pendingRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const start = (args: Omit<NonNullable<DragSession>, "pointerId"> & { pointerId: number }) => {
    sessionRef.current = args as DragSession;
  };

  const update = (pointer: Vec2) => {
    const s = sessionRef.current;
    if (!s) return;

    const dx = pointer.x - s.originPointer.x;
    const dy = pointer.y - s.originPointer.y;

    schedule(() => {
      if (s.mode === "move") {
        params.onMove(s.id, { x: s.originPos.x + dx, y: s.originPos.y + dy });
      } else {
        params.onResize(s.id, { w: s.originSize.w + dx, h: s.originSize.h + dy });
      }
    });
  };

  const stop = () => {
    sessionRef.current = null;
  };

  return { start, update, stop };
}