# 🚚 GigWise - Google Maps Platform Awards

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.x-yellow.svg)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-API-red.svg)](https://developers.google.com/maps)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange.svg)](https://ai.google.dev/gemini)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Hosting-blue.svg)](https://firebase.google.com/)
[![LangChain](https://img.shields.io/badge/LangChain-AI%20Framework-purple.svg)](https://langchain.com/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-orange.svg)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-yellow.svg)](https://vitejs.dev/)

Smart delivery tracking platform for gig drivers to track performance, identify high-earning clusters, and optimize their routes using advanced AI and machine learning algorithms.

## 🚀 Main Features 
### 1. Interactive Mapping 🗺️
**Multi-View Mapping System**: Unlike other platforms that offer basic location tracking, GigWise provides three distinct mapping views, each designed for specific driver needs:

#### **Marker View** 📍
- **Purpose**: Individual delivery point visualization for detailed analysis. 

#### **Heatmap View** 🧭
- **Purpose**: Visual representation of delivery density and tip intensity. 

#### **Cluster View using AI-Powered Route Optimization** 🧲
- **Purpose**: Our DBSCAN clustering algorithm analyzes your delivery data to identify profitable zones and optimal delivery patterns.

### 2. Delivery Data Management 💻
Upload delivery data through manual form entry or CSV file upload. Track date, time, address, tips, totals, and platform information to build a comprehensive delivery history.

### 4. AI Assistant for Delivery Insights 📈
Ask questions about your delivery data and receive intelligent responses powered by Google's Gemini AI. Get insights about your performance, patterns, and optimization opportunities.

## 🛠️ Technologies Used 
**Frontend**: React 19.1.0, Vite, Google Maps API, Firebase Auth, Modern CSS

**Backend**: Node.js, Express.js, MongoDB with Mongoose ODM

**Database**: MongoDB Atlas for scalable cloud storage

**AI & Analytics**: Python, Scikit-learn (DBSCAN clustering), Google Generative AI (Gemini), LangChain

**Authentication**: Firebase Auth, Google OAuth, JWT tokens

**Infrastructure**: Google Cloud Platform, Firebase hosting

## 🎬 How to Run the Code

Follow these steps to get the GigWise platform up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or above)
- Python 3.8+
- npm (comes with Node.js)
- Git (optional, for cloning the repository)
- MongoDB Atlas account
- Google Cloud Platform account
- Firebase project

### 1. Clone the Repository

If you haven't already cloned the repository, run the following command:

```bash
git clone https://github.com/yourusername/gigwise.git
```

Then navigate into the project directory:

```bash
cd gigwise
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_GOOGLE_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### 4. Python Dependencies

```bash
cd ../server
pip install pymongo scikit-learn shapely numpy python-dotenv certifi
```

### 5. Start the Development Server

**Start the Backend Server:**
```bash
cd server
npm start
```
The server will run on `http://localhost:3001`

**Start the Frontend Development Server:**
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5173`

The application will start on `http://localhost:5173`. Open this URL in your browser to view the app.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Google OAuth authentication
- `GET /api/auth/verify` - Verify JWT token

### Deliveries
- `GET /api/deliveries/all` - Get all deliveries for authenticated user
- `POST /api/deliveries` - Create new delivery (manual form)
- `POST /api/deliveries/upload` - Upload CSV delivery data

### Clustering
- `POST /api/clusters/run` - Run DBSCAN clustering algorithm
- `GET /api/clusters` - Get cluster data for map visualization

### AI Assistant
- `POST /api/ask-ai` - Ask questions to the AI assistant
