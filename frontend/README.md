# Job Tracker Frontend

A React-based frontend for the Job Tracker application built with Vite and TypeScript.

## Features

- Kanban board view for job applications
- Job status tracking (Saved, Applied, Interviewing, Offer, Rejected)
- Job details display with company, location, and description
- Direct links to job postings
- Delete jobs functionality
- Status change dropdown (UI only for now)

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Vanilla CSS for styling
- Fetch API for backend communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### API Configuration

The app expects a backend API running on `http://localhost:8080`. You can change this by modifying the `.env` file:

```
VITE_API_BASE_URL=http://your-backend-url:port
```

## Project Structure

```
src/
├── components/
│   ├── JobCard.tsx          # Individual job card component
│   └── KanbanColumn.tsx     # Kanban column component
├── pages/
│   └── Dashboard.tsx        # Main dashboard page
├── services/
│   └── api.ts              # API service functions
├── types/
│   └── job.ts              # TypeScript type definitions
├── App.tsx                 # Main app component
├── App.css                 # Main styles
├── main.tsx               # App entry point
└── index.css              # Global styles
```

## Backend API

The frontend expects the following API endpoints:

- `GET /jobs` - Fetch all jobs
- `DELETE /jobs/{id}` - Delete a job by ID

Future endpoints (when implemented):

- `PATCH /applications/{id}` - Update job status
