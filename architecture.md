Architecture overview

The app is a single-page React application. The `StickyBoard` component holds an array of `Note` objects and is responsible for creating, removing, and persisting notes. Each `Note` component manages its own interaction behavior (dragging/resizing) locally and emits updates back to `StickyBoard`.

Notes are persisted to `localStorage` under `sticky_notes_v1` and restored on load. The `StickyBoard` keeps track of a `z` index for each note so user interactions bring the focused note to the front.

Component responsibilities:
- StickyBoard: stateful parent, note collection lifecycle, creation on double-click, persistence, and z-index management.
- Note: visual and interaction behavior (drag, resize, inline editing), exposes `onRemove`, `onUpdate`, and `onFocus` callbacks to parent.

Testing: Vitest + Testing Library for small unit tests. CI runs lint/build/test on push.