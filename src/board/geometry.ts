import { Rect, Size, Vec2 } from "./boardTypes";

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function clampPos(pos: Vec2, size: Size, bounds: Size): Vec2 {
  return {
    x: clamp(pos.x, 0, Math.max(0, bounds.w - size.w)),
    y: clamp(pos.y, 0, Math.max(0, bounds.h - size.h)),
  };
}

export function minSize(size: Size, minW = 140, minH = 110): Size {
  return { w: Math.max(minW, size.w), h: Math.max(minH, size.h) };
}

export function rectContainsPoint(r: Rect, p: Vec2): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}