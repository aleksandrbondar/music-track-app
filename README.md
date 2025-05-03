# Music Tracks Management App

## Description

This is a full-stack web application for managing a personal collection of music tracks. It consists of a React frontend (built with Vite) and a Node.js backend (built with Fastify). The application allows users to view, create, edit, delete, search, filter, sort, and upload audio files for music tracks.

This project utilizes a monorepo-like structure with separate `frontend` and `backend` directories. A root-level `package.json` manages concurrent execution of both parts during development using `concurrently`.

## Features

* **Track Management (CRUD):** Create, Read, Update, and Delete music tracks.
* **Rich Track Data:** Store title, artist, album (optional), multiple genres, and cover image URL.
* **Audio File Handling:** Upload (MP3, WAV) and delete audio files associated with tracks.
* **Inline Playback:** Play uploaded audio tracks directly within the track list.
* **Waveform Visualization:** Visual waveform display for playable tracks using `wavesurfer.js`.
* **Pagination:** Efficiently browse large track collections.
* **Filtering:** Filter tracks by genre or artist.
* **Sorting:** Sort tracks by title, artist, album, or creation date.
* **Search:** Debounced search functionality across title, artist, and album fields.
* **Bulk Operations:** Select multiple tracks for bulk deletion with confirmation.
* **User Feedback:** Toast notifications for success/error messages.
* **Loading States:** Clear visual indicators during data operations.
* **API Documentation:** Backend provides Swagger UI for API exploration.

## Project Structure

```text
music-tracks-app/
├── backend/         # Node.js (Fastify) backend application
│   ├── data/        # Runtime data storage (track JSON files, uploads)
│   ├── src/         # Backend source code (TypeScript)
│   ├── Dockerfile   # (Optional - for Docker setup)
│   └── package.json # Backend dependencies and scripts
├── frontend/        # React (Vite) frontend application
│   ├── public/      # Static assets
│   ├── src/         # Frontend source code (TypeScript, SCSS)
│   ├── Dockerfile   # (Optional - for Docker setup)
│   └── package.json # Frontend dependencies and scripts
├── .env             # (Optional - root env vars, e.g. for concurrently)
├── package.json     # Root dependencies (like concurrently) and main scripts
└── README.md        # This file
```

## Technology Stack

**Backend:**

* **Framework:** Fastify (Node.js)
* **Language:** TypeScript
* **Runtime:** Node.js (v20.13.1 or higher recommended)
* **Development Server:** `nodemon`, `ts-node`
* **Configuration:** `dotenv`, `zod`
* **API Documentation:** `@fastify/swagger`, `@fastify/swagger-ui`
* **File Handling:** `@fastify/multipart`, `@fastify/static`
* **Data Storage:** File system (JSON files for track metadata, raw files for uploads)
* **Logging:** Pino (`pino-pretty` for development)
* **Testing:** Vitest

**Frontend:**

* **Framework:** React (with Vite)
* **Language:** TypeScript
* **Styling:** SCSS
* **API Client:** Axios
* **State Management/Caching:** React Query (`@tanstack/react-query`)
* **Routing:** React Router (`react-router-dom`)
* **Notifications:** `react-toastify`
* **Waveform Visualization:** `wavesurfer.js`

**Development Coordination:**

* **Concurrent Execution:** `concurrently`

## Prerequisites

* Node.js (v20.13.1 or higher - check `backend/package.json` for specific engine requirement)
* npm (v10.5.2 or higher) or yarn

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd music-tracks-app
    ```

2.  **Install Dependencies:**
    This command installs dependencies for the root, frontend, and backend projects.
    ```bash
    npm run install:all
    # or if you created a yarn equivalent script
    # yarn install:all 
    ```
    *(This assumes you have the `install:all` script defined in your root `package.json` as shown in the previous answer. If not, run `npm install` in the root, `backend`, and `frontend` directories separately).*

3.  **Configure Environment Variables:**
    * **Backend:** Create a `.env` file inside the `backend/` directory. You can copy `backend/.env.example` if it exists, or create it manually. Key variables include:
        ```dotenv
        # backend/.env
        PORT=8000
        HOST=0.0.0.0
        NODE_ENV=development
        DATA_DIR=./data
        TRACKS_DIR=./data/tracks
        UPLOADS_DIR=./data/uploads
        GENRES_FILE=./data/genres.json
        CORS_ORIGIN=http://localhost:3000 # Allow requests from the frontend dev server
        LOG_LEVEL=info
        MAX_FILE_SIZE=10485760 # 10MB
        ```
    * **Frontend:** Create a `.env` file inside the `frontend/` directory:
        ```dotenv
        # frontend/.env
        VITE_API_BASE_URL=http://localhost:8000/api 
        ```

4.  **(Optional) Initialize/Reset Backend Data:**
    If you want to start with fresh data or reset to initial sample data provided in `backend/data-initial`:
    ```bash
    npm run bd:reset --prefix backend
    ```

5.  **(Optional) Seed Backend Database:**
    To populate the backend with randomly generated sample data:
    ```bash
    npm run seed --prefix backend
    ```

## Running the Application (Development)

To start both the backend and frontend development servers concurrently:

```bash
# Run from the root directory (music-tracks-app)
npm run dev