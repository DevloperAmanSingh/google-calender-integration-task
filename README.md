# Google Calendar Sync Application

A real-time Google Calendar synchronization application built with Next.js frontend and Express.js backend that provides live updates when calendar events are created, updated, or deleted.

## What This App Does

This application connects to your Google Calendar and provides real-time synchronization with instant notifications whenever events change. Users can authenticate with Google OAuth2, view their upcoming calendar events, and receive live updates without needing to refresh the page.

## Key Features

### 1. **Real-Time  Changes**

- Live updates when events are created, updated, or deleted

### 2. **Google Calendar Integration with Webhooks**

- Full Google OAuth2 authentication flow
- Google Calendar API integration with webhook subscriptions
- Automatic sync token management for efficient  updates

### 3. **Smart Polling **

- Automatic event fetching every 5 seconds
- Background updates without loading indicators

## Architecture
<img width="4063" height="1563" alt="image" src="https://github.com/user-attachments/assets/0716613a-95a9-4087-b529-ece2e2a0e1d0" />

## Video Demo 

https://github.com/user-attachments/assets/0ec71ae4-2442-46fb-bd69-606eceabdef1

## Technical Decisions Made

### **Authentication Strategy**

- Used server-side OAuth2 integration with Google.
- Tokens are stored securely in Redis (Upstash) and are mapped using the user's email address.
- A secure, HTTP-only cookie stores the email on the frontend for persistent identification without exposing sensitive information.

### Calender Sync Mechanism**

- Implemented Google Calendar Webhooks via the `watch()` API to detect changes in real-time.
- Backend listens to calendar change notifications via webhook route and it will sync the calender using syncToken.

### **Event Change Detection**

- Here I have used Google’s incremental sync (syncToken) to fetch only changed events, reducing API calls.
- After the new changes are received from the google calender using `synctoken` we update those changes in the redis and display in the UI within 3-4 sec

### **Frontend Sync & Polling**
- Frontend polls /events periodically like every 5 sec to get the latest data from the redis and reflect in the ui



## Trade-offs and Limitations

- We have used polling + webhook sync instead of WebSockets for fetching the latest event from the API to the frontend. One of the limitation of the polling is that it may cause a slight delay (few seconds) in updates.

- We are replying on google `syncToken` to get updates which reduces API usage drastically. 

- I have used redis to store the events and other details of the user . But in production we can always shift to better and reliable database for the smooth workflow of the environment. 

## Getting Started

### Backend Setup

```bash
cd google-calendar-sync
npm install
# Set up .env with Google OAuth credentials
npm run dev  # Runs on port 3000
```

### Frontend Setup

```bash
cd google-calender-sync-fe
npm install
npm run dev  # Runs on port 3001
```

### Google OAuth Setup

1. Create Google Cloud Project
2. Enable Calendar API
3. Create OAuth2 credentials
4. Add redirect URI: `http://localhost:3000/auth/callback`
5. Set environment variables in backend `.env`

