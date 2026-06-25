# ✈️ TravelAI — AI Travel Planner

An AI-powered full-stack travel planning application that helps users create personalized trips, generate day-wise itineraries, discover hotel recommendations, estimate travel budgets, and manage travel plans from one dashboard.

## 🌐 Live Demo

- **Frontend:** https://travelai-jet-ten.vercel.app
- **Backend API:** https://travelai-api.onrender.com
- **GitHub Repository:** https://github.com/Nishtha1311/ai-travel-planner

---

## ✨ Features

### Authentication
- User registration and login
- JWT authentication stored in secure HTTP-only cookies
- Protected routes for authenticated users
- Logout functionality

### Trip Management
- Create personalized travel trips
- View all saved trips on a dashboard
- View detailed trip information
- Delete trips with a confirmation modal
- Responsive, modern dashboard UI

### AI-Powered Planning
- Generate personalized day-wise itineraries using Google Gemini API
- AI hotel recommendations based on destination and budget
- Regenerate an individual itinerary day with custom instructions
- Edit saved itinerary days manually
- Graceful fallback when Gemini API quota is unavailable

### Budget Estimation
- Estimated transport cost
- Estimated accommodation cost
- Estimated food cost
- Estimated activity cost
- Total trip cost and per-traveler estimate

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- Axios
- React Hot Toast
- Lucide React Icons
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser
- Google Gemini API

### Deployment
- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on MongoDB Atlas

---

## 📁 Project Structure

```text
ai-travel-planner/
│
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   ├── lib/
│   │   └── components/
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
└── README.md