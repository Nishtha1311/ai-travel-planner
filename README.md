# ✈️ TravelAI — AI Travel Planner

An AI-powered full-stack travel planning application that helps users create personalized trips, generate day-wise itineraries, discover hotel recommendations, estimate travel budgets, and manage travel plans from one dashboard.

## 🌐 Live Demo

* **Frontend:** https://travelai-jet-ten.vercel.app
* **Backend API:** https://travelai-api.onrender.com
* **GitHub Repository:** https://github.com/Nishtha1311/ai-travel-planner

---

## ✨ Features

### Authentication & Authorization

* User registration and login
* JWT authentication stored in secure HTTP-only cookies
* Protected routes for authenticated users
* Logout functionality
* User-specific trip data with authorization checks on backend routes

### Trip Management

* Create personalized travel trips
* View all saved trips on a dashboard
* View detailed trip information
* Delete trips with a confirmation modal
* Responsive, modern dashboard UI

### AI-Powered Planning

* Generate personalized day-wise itineraries using Google Gemini API
* AI hotel recommendations based on destination and budget
* Regenerate an individual itinerary day with optional custom instructions
* Edit saved itinerary days manually
* Graceful fallback when Gemini API quota is unavailable

### Budget Estimation

* Estimated transport cost
* Estimated accommodation cost
* Estimated food cost
* Estimated activity cost
* Total trip cost and per-traveler estimate

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* Axios
* React Hot Toast
* Lucide React Icons
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Cookie Parser
* Google Gemini API

### Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* Database hosted on MongoDB Atlas

---

## 🏗️ High-Level Architecture

```text
User Browser
     │
     ▼
Next.js Frontend (Vercel)
     │  Axios requests with credentials
     ▼
Express API (Render)
     │
     ├── MongoDB Atlas
     │     ├── Users
     │     └── Trips
     │
     └── Google Gemini API
           ├── Day-wise itinerary
           └── Hotel recommendations
```

The frontend collects trip details and communicates with the Express backend through REST APIs. The backend handles authentication, authorization, trip storage, budget estimation, and AI requests. MongoDB Atlas stores user and trip data, while Gemini generates personalized itinerary content.

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
│   │   ├── prompts/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Nishtha1311/ai-travel-planner.git
cd ai-travel-planner
```

### 2. Backend setup

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and fill in your own values.

Your `server/.env` should contain:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔐 Authentication and Authorization

TravelAI uses JWT-based authentication.

1. A user registers or logs in.
2. The backend creates a JWT token.
3. The token is stored in an HTTP-only cookie.
4. Protected backend routes use authentication middleware to verify the token.
5. Every trip query includes the logged-in user ID, so users can only access, edit, regenerate, or delete their own trips.

This ensures strict data isolation between users.

---

## 🤖 AI Agent Design

Google Gemini is used to generate structured travel plans.

The backend creates a prompt using trip details such as:

* Destination
* Number of days
* Budget preference
* Number of travelers
* Travel style
* Interests
* Transport preference

Gemini returns structured JSON containing:

* Day-wise itinerary
* Activities for each day
* Hotel recommendations
* Budget-related travel suggestions

The backend validates and saves the response in MongoDB. Users can also regenerate a single day with custom instructions.

---

## 💡 Custom Feature: AI-Resilient Manual Planning

The custom feature in TravelAI is an **AI-resilient planning fallback**.

If Gemini is temporarily unavailable or its free-tier quota is exceeded:

* The trip remains saved.
* Users see a clear AI-unavailable message.
* Users can build a manual day-wise itinerary.
* Users can add, edit, and remove activities.
* The manual itinerary is saved to the same trip.
* Users can try AI generation again later.

### Why this feature was added

AI APIs can have temporary outages, high demand, or quota limits. Without a fallback, users would be blocked from planning their trip. This feature keeps the core planning workflow usable even when the AI provider is unavailable.

---

## ⚖️ Key Design Decisions and Trade-Offs

### HTTP-only cookies for JWT storage

JWT tokens are stored in HTTP-only cookies instead of local storage to reduce exposure to JavaScript-based token theft.

### Separate frontend and backend deployment

The frontend is deployed on Vercel and the backend on Render. This keeps the frontend fast and makes backend scaling or changes independent.

### Gemini JSON responses

The Gemini prompt requests JSON output so the backend can save and render structured itinerary data more reliably.

### Manual fallback instead of repeated AI retries

The application retries temporary AI busy errors, but does not repeatedly retry quota errors. Repeated quota requests waste API calls, so users are given a manual planning option instead.

### Estimated budget instead of live pricing

The budget is an approximate planning estimate. Live flight, hotel, and activity prices would require additional third-party travel APIs.

---

## ⚠️ Known Limitations

* Gemini free-tier quota can be exceeded during frequent testing.
* Budget estimates are approximate and do not use live travel pricing APIs.
* Hotel recommendations are AI-generated and should be verified by users before booking.
* Render free-tier services can take time to wake up after inactivity.
* Cross-domain cookie behavior can vary based on browser privacy settings.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Register a new user        |
| POST   | `/api/auth/login`    | Login user                 |
| POST   | `/api/auth/logout`   | Logout user                |
| GET    | `/api/auth/me`       | Get current logged-in user |

### Trips

| Method | Endpoint                              | Description                          |
| ------ | ------------------------------------- | ------------------------------------ |
| POST   | `/api/trips`                          | Create a new trip                    |
| GET    | `/api/trips`                          | Get all trips for the logged-in user |
| GET    | `/api/trips/:tripId`                  | Get one trip                         |
| PUT    | `/api/trips/:tripId/manual-itinerary` | Save a manual itinerary              |
| DELETE | `/api/trips/:tripId`                  | Delete a trip                        |

### AI Itinerary

| Method | Endpoint                                    | Description                    |
| ------ | ------------------------------------------- | ------------------------------ |
| POST   | `/api/ai/generate-trip/:tripId`             | Generate complete AI itinerary |
| POST   | `/api/ai/regenerate-day/:tripId/:dayNumber` | Regenerate one itinerary day   |
| GET    | `/api/ai/test`                              | Test Gemini API connection     |

---

## 👩‍💻 Author

**Nishtha Vatsa**

* GitHub: https://github.com/Nishtha1311
* LinkedIn: https://www.linkedin.com/in/nishtha-vatsa
