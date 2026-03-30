# 🐿️ RATATOS: Protocol v2.1
> **A high-frequency, real-time signal broadcasting terminal built on the "World Tree" architecture.**

## 🚀 Overview
Ratatos is a specialized communication protocol designed for instantaneous data synchronization. It utilizes WebSockets to "pulse" messages across all connected nodes, providing a low-latency, terminal-style interface for secure signal transmission.

## 🛠️ Technical Stack
* **Framework:** Next.js (App Router)
* **Real-Time Engine:** Pusher (WebSockets)
* **Database:** Supabase (PostgreSQL)
* **Styling:** Tailwind CSS (Cyber-Grid Aesthetic)
* **State Management:** React Hooks with Optimistic UI Updates

## ✨ Engineering Highlights
* **Bi-Directional Pulse:** Leverages Pusher to bind to the `world-tree` channel, ensuring all clients receive `new-pulse` events in milliseconds without page refreshes.
* **Optimistic UI Layer:** Implemented an optimistic update pattern for the `WIPE` (delete) command, removing signals from the local state before the API confirmation to ensure zero-latency UX.
* **Hybrid Persistence:** Combines real-time broadcasting with Supabase-backed historical retrieval, ensuring signal nodes are preserved even after terminal restarts.
* **Hadal Interface:** A custom-built, monospace terminal UI designed for high-density signal monitoring.

## 📦 Setup
1. Define your `SUPABASE_URL` and `PUSHER_KEY` in `.env`.
2. `npm install`
3. `npm run dev`
4. Broadcast your first signal to the network.
