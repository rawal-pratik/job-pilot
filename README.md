# Job Pilot
Job Pilot is a personal job application tracker that keeps track of every job I apply to and automatically updates the status of my applications.

The goal is to have one place where I can see all the jobs I've applied to, the current status of each application, and the complete history of what happened after applying.

Job applications can be added manually, captured automatically from supported job platforms, or detected through Gmail.

## Core Features
- Track job applications
- Store information about each job
- Store complete job descriptions
- Track application status
- Maintain an application timeline
- Connect Gmail and detect application-related emails
- Automatically match emails to existing applications
- Detect duplicate applications
- Capture applications from LinkedIn and other job platforms through a browser extension
- View job-search analytics
- Use AI to analyze job descriptions and provide insights

## Application Lifecycle
An application can move through the following states:
- Applied
- Interview
- Offer
- Rejected
- No Response
- Withdrawn
Every important change to an application is recorded as an event in its timeline.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript

### Backend
- Node.js
- Express
- JavaScript

### Database
- PostgreSQL

### Future Integrations
- Gmail API
- Chrome Extension
- Claude / OpenRouter APIs

## Project Structure
The project will eventually contain:
```text
job-pilot/
├── frontend/
├── backend/
└── extension/

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev