# Sticky Notes App

Single-page Sticky Notes app built with React + TypeScript (Vite).

Features
- Create a note at a chosen position and preset size (Toolbar → New note → click board)
- Move a note by dragging its header
- Resize a note by dragging the bottom-right handle
- Delete a note by dragging it over the Trash zone
- Inline editing of note text
- Bring note to front on focus/drag
- Persistence to localStorage (restores on reload)

Project structure
- src/board — state, reducer, geometry, storage, pointer hook, Board component
- src/note — Note component and styles
- src/ui — Toolbar and TrashZone
- src/app — App entry
- src/styles, src/note — global and note styles

Run locally

1. npm install
2. npm run dev

Build

- npm run build
- npm run preview

Test

- npm run test

Browser support: latest Chrome, Firefox, Edge (desktop). Minimum screen: 1024x768.

Windows PowerShell note: If `npm install` or other npm scripts fail on Windows with errors about running scripts being disabled, you can run the installer version of Node or adjust the current user's execution policy (e.g., `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`) and then re-open PowerShell. If you're in an environment where you cannot change policies, run the commands in Git Bash or WSL instead.