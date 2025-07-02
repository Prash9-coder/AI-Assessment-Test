# AI Assessment Test Platform

A comprehensive assessment platform built with React, Node.js, and MongoDB for conducting online tests with AI-powered features.

## 🚀 Dynamic API Integration Complete!

All candidate pages are now fully integrated with real APIs:

### ✅ Features Implemented:
- **Dynamic Dashboard**: Real-time test data and statistics
- **Dynamic Test Listing**: Live test availability from database
- **Dynamic Test Taking**: Real test questions and submission
- **Dynamic Results**: Actual attempt history and scores
- **Real Authentication**: JWT-based auth system
- **API Error Handling**: Proper loading states and error messages

### 🔧 API Endpoints Used:
- `GET /api/test/available` - Get available tests for candidates
- `GET /api/test/:id` - Get specific test details
- `POST /api/test/:testId/submit` - Submit test attempt
- `GET /api/test/my-attempts` - Get user's test attempts
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

## 🏃‍♂️ Quick Start

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```

### 3. Test the API Integration
```bash
node test-api.js
```

## 📱 How to Use

### For HR Users:
1. Register/Login as HR at `/hr/login`
2. Create tests in the HR dashboard
3. View candidate attempts and results

### For Candidates:
1. Register/Login as candidate at `/login`
2. View available tests in dashboard
3. Take tests and view results

## 🔧 Technical Implementation

### Frontend (React + Vite)
- **Services Layer**: `client/src/services/api.js` - Centralized API calls
- **Custom Hooks**: `client/src/hooks/useTests.js` - Test data management
- **Dynamic Components**: All candidate pages now use real data
- **Error Handling**: Loading states and error messages
- **Authentication**: JWT token management

### Backend (Node.js + Express)
- **New Endpoints**: Added `/available` and `/my-attempts` routes
- **Enhanced Controllers**: Better error handling and data population
- **Authentication**: JWT middleware for protected routes
- **Database**: MongoDB with Mongoose ODM

### Key Files Modified:
- `client/src/pages/candidate/Dashboard.jsx` - Dynamic dashboard
- `client/src/pages/candidate/StartTest.jsx` - Live test listing
- `client/src/pages/candidate/TakeTest.jsx` - Real test taking
- `client/src/pages/candidate/PreviousResults.jsx` - Actual results
- `server/controllers/test-controller.js` - Enhanced API endpoints
- `server/router/test-router.js` - New routes added

## 🎯 What's Dynamic Now:

1. **Dashboard Stats**: Real counts of pending/completed tests
2. **Test Cards**: Actual test data from database
3. **Test Questions**: Real questions with proper scoring
4. **Results History**: Actual attempt data with scores
5. **Performance Analytics**: Real data-driven charts
6. **Loading States**: Proper UX during API calls
7. **Error Handling**: User-friendly error messages

The system is now fully functional with real data flow between frontend and backend!