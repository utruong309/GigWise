# 🚚 GigWise - Google Maps Platform Awards

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.x-yellow.svg)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-API-red.svg)](https://developers.google.com/maps)

## ✨ Main Features 
### 1. Interactive Mapping 🗺️📄
**Multi-View Mapping System**: Unlike other platforms that offer basic location tracking, GigWise provides three distinct mapping views, each designed for specific driver needs:

#### **Marker View** 📍
- **Purpose**: Individual delivery point visualization for detailed analysis
- **Benefits for Drivers**:
  - See exact locations of each delivery with earnings data
  - View tip amounts and platform information on hover
  - Track individual delivery performance and customer preferences
  - Plan specific routes between individual stops
  - Analyze which areas have the best tips and ratings

#### **Heatmap View** 🔥
- **Purpose**: Visual representation of delivery density and tip intensity
- **Benefits for Drivers**:
  - Instantly identify the most active delivery zones
  - See which areas have the highest concentration of orders
  - Understand tip patterns across different neighborhoods
  - Make informed decisions about where to position themselves during slow periods
  - Optimize their base location for maximum order volume

#### **Cluster View** 🎯
- **Purpose**: AI-powered clustering to identify profitable delivery zones
- **Benefits for Drivers**:
  - Discover hidden profitable areas they might have missed
  - View cluster polygons with earnings and tip data
  - See total earnings and average tips per cluster
  - Identify most active hours for each cluster
  - Make data-driven decisions about which zones to focus on

### 2. AI-Powered Route Optimization 🎤
**Smart Clustering Algorithm**: Our DBSCAN clustering algorithm analyzes your delivery data to identify profitable zones and optimal delivery patterns.

- **Real-time Analysis**: Get instant insights about your delivery performance
- **Predictive Recommendations**: AI suggests the best times and locations for maximum earnings
- **Personalized Insights**: Tailored recommendations based on your specific delivery history

### 3. Delivery Data Management 💻
Upload delivery data through manual form entry or CSV file upload. Track date, time, address, tips, totals, and platform information to build a comprehensive delivery history.

### 4. AI Assistant for Delivery Insights 📈
Ask questions about your delivery data and receive intelligent responses powered by Google's Gemini AI. Get insights about your performance, patterns, and optimization opportunities.

## 🚀 How to Run the Code

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

## 🏗️ Architecture

```
GigWise/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── DeliveryUploader.jsx    # Manual form and CSV upload
│   │   │   ├── MapView.jsx             # Marker and heatmap views
│   │   │   ├── MapClusters.jsx         # Cluster visualization
│   │   │   └── AIDeliveryAssistant.jsx # AI chat interface
│   │   ├── firebase/       # Firebase configuration
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
├── server/                 # Node.js backend
│   ├── routes/             # API route handlers
│   │   ├── deliveries.js   # Delivery CRUD operations
│   │   ├── clusters.js     # Clustering endpoints
│   │   └── ask.js          # AI assistant endpoint
│   ├── controllers/        # Business logic
│   ├── models/             # MongoDB schemas
│   │   └── Delivery.js     # Delivery data model
│   ├── middleware/         # Express middleware
│   ├── ai/                 # AI integration
│   │   ├── askGemini.js    # Gemini AI integration
│   │   └── ingestDeliveries.js # Data ingestion for AI
│   └── clustering.py       # Python clustering script
└── README.md
```

### Data Flow
1. **Authentication**: Google OAuth → Firebase → JWT token
2. **Data Upload**: Manual form/CSV → MongoDB → Real-time sync
3. **Clustering**: Python script → DBSCAN → JSON output
4. **AI Insights**: User query → Gemini AI → LangChain response
5. **Map Visualization**: Google Maps API → React components
