# Music Tracks Management App

This application allows users to manage a collection of music tracks, including creating, editing, deleting, uploading audio files, filtering, sorting, and searching.

## Features

* **Track Listing:** View all tracks with pagination, sorting, and filtering options.
* **Search:** Search tracks by title, artist, or album with debounce.
* **Create Track:** Add new tracks with metadata (title, artist, album, genres, cover image URL) via a modal form.
* **Edit Track:** Modify existing track metadata via a modal form.
* **Delete Track:** Remove tracks individually with confirmation.
* **Upload Audio:** Upload MP3/WAV/OGG files to existing tracks with validation and progress indicator.
* **Delete Audio:** Remove uploaded audio files from tracks.
* **Inline Playback:** Play uploaded audio files directly in the list view (one at a time).
* **Notifications:** User feedback via toast notifications for operations.
* **Loading States:** Visual indicators during data fetching/mutation.
* **Client-Side Validation:** Input validation on forms (required fields, URL format, file type/size).
* **Styling:** Styled using SCSS.

**Extra Features Implemented:**

* **Bulk Delete:** Select multiple tracks using checkboxes and delete them simultaneously with a confirmation step. Includes "Select All Visible" functionality.
* **Audio Waveform Visualization:** Displays a visual waveform for playable audio tracks using `wavesurfer.js`.

**Potentially Implemented (Conceptual):**

* **Optimistic Updates:** (Conceptualized) Discussed the approach for immediate UI feedback on operations like edit/create/delete, recommending libraries like React Query for robust implementation.

## Tech Stack

* **Framework:** React.js (with Vite)
* **Language:** TypeScript
* **Styling:** SCSS
* **API Client:** Axios
* **Notifications:** react-toastify
* **Waveform:** wavesurfer.js

## Prerequisites

* Node.js (v20.13.1 recommended or as specified in `.nvmrc`)
* npm or yarn
* A running instance of the backend API server (expected at `http://localhost:8000` by default).

## Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd music-tracks-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory. Add the API base URL:
    ```env
    # URL вашего работающего backend API
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
    *(См. детали ниже в разделе "Настройка .env")*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application should now be available at `http://localhost:3000`.

5.  **Build for Production:**
    ```bash
    npm run build
    # or
    # yarn build
    ```
    Static files will be generated in the `dist` folder.

## Backend API

This frontend requires the backend API server (provided separately for the test task) to be running. Ensure the server is running on `http://localhost:8000` before starting the frontend. API documentation is available at `http://localhost:8000/documentation`.

**For Deployment:** The backend API needs to be deployed separately and its public URL configured in the frontend's environment variables (`VITE_API_BASE_URL`).

## Deployment (Vercel Example)

You can easily deploy this static React application (built with Vite) to [Vercel](https://vercel.com/).

**Method 1: Using Vercel CLI**

1.  Install Vercel CLI: `npm install -g vercel`
2.  Login: `vercel login`
3.  Deploy: `vercel --prod`
    * Confirm project settings (Build: `npm run build`, Output: `dist`).

**Method 2: Connecting Git Repository**

1.  Push code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Log in to Vercel, click "Add New..." -> "Project".
3.  Connect Git provider and select the repository.
4.  Configure Project:
    * **Framework Preset:** Should detect "Vite".
    * **Build Command:** Ensure it's `npm run build`.
    * **Output Directory:** Ensure it's `dist`.
    * **Environment Variables:** Add `VITE_API_BASE_URL` with the **URL of your deployed backend API** (e.g., `https://your-deployed-api.com/api`).
5.  Click "Deploy".

**Important Deployment Notes:**

* **Backend Deployment:** The backend **must** be deployed separately.
* **CORS:** Your deployed backend API needs CORS configured to accept requests from your Vercel frontend domain.
* **Environment Variables:** Use Vercel's environment variable settings for `VITE_API_BASE_URL` in production.