#Mini Social Wall - Full-Stack Application

A modern, production-ready social media application built with React, Node.js, Express, and MongoDB.

#Features

#Complete Authentication System
- User signup and login with JWT
- Password hashing with bcrypt
- Protected routes
- Persistent sessions with localStorage
- Secure token-based authentication

#Social Features
- Posts: Create posts with text and images
- Likes: Like/unlike posts with no duplicate likes
- Comments: Add comments to posts
- Feed: View all posts from all users in chronological order
- User Attribution: All posts/comments show username

#Modern UI/UX
- Responsive design (mobile-friendly)
- Empty states (no posts, no comments)
- Error handling with user feedback
- Optimistic UI updates for likes
- Clean, modern design with Tailwind CSS

#Security Features
- JWT authentication
- Password hashing
- Protected API routes
- Input validation
- Error handling middleware


#Setup Instructions

#Prerequisites
- Node.js
- MongoDB (running locally on port 27017)
- npm

#Backend Setup

1. Navigate to backend directory:
cd backend

2. Install dependencies:
npm install

4. Start the backend server:
npm start

Backend will run on `http://localhost:5000`

#Frontend Setup

1. Navigate to frontend directory:
cd frontend/socialFeed

2. Install dependencies:
npm install

3. Start the development server:
npm run dev

Frontend will run on `http://localhost:5173` (or next available port)
