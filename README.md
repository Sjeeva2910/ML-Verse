# 🤖 ML-Verse

**ML-Verse** is a full-stack Machine Learning platform designed to bring useful ML-powered features together in a single web application.

The project provides an interactive interface for exploring machine-learning-based recommendations and comparison features through a modern web application.

## ✨ Features

* 🤖 Machine Learning powered features
* 🔍 Recommendation system
* ⚖️ Comparison functionality
* 🌐 Full-stack web application
* 🚀 REST API based backend
* 🛡️ API rate limiting
* 🔐 Environment-based configuration
* 💻 Responsive and interactive frontend

## 🏗️ Project Structure

```text
ML-Verse-main/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   └── rateLimiter.js
│   │
│   ├── routes/
│   │   ├── compare.js
│   │   └── recommend.js
│   │
│   ├── services/
│   │   └── groq.js
│   │
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── package.json
└── package-lock.json
```

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js
* REST API

### AI / ML

* AI-powered recommendation functionality
* Groq API integration

### Security & Middleware

* API Rate Limiting
* Environment Variables

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sjeeva2910/ML-Verse.git
cd ML-Verse
```

### 2. Install Dependencies

Install the root dependencies:

```bash
npm install
```

Then install the client dependencies:

```bash
cd ML-Verse-main/client
npm install
```

Install the server dependencies:

```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

Use `.env.example` as a reference:

```env
GROQ_API_KEY=your_api_key_here
```

> ⚠️ Never commit your real API keys or secrets to GitHub.

### 4. Run the Application

Start the backend server:

```bash
cd server
npm start
```

Start the frontend:

```bash
cd client
npm run dev
```

The development server will provide a local URL in the terminal.

## 🔌 API Modules

### Recommendation

The recommendation module provides AI-powered recommendations based on user input.

### Comparison

The comparison module allows users to compare available options using the application's backend services.

## 📁 Main Backend Components

| Component                   | Purpose                       |
| --------------------------- | ----------------------------- |
| `index.js`                  | Main backend server           |
| `routes/recommend.js`       | Recommendation API routes     |
| `routes/compare.js`         | Comparison API routes         |
| `services/groq.js`          | Groq API service              |
| `middleware/rateLimiter.js` | API request rate limiting     |
| `.env.example`              | Environment variable template |

## 🔒 Security

The project follows basic security practices including:

* Environment variables for sensitive configuration
* API rate limiting
* Separate frontend and backend architecture
* `.env.example` for sharing configuration structure without exposing secrets

## 🎯 Project Goals

ML-Verse aims to provide a simple and accessible platform for interacting with machine-learning and AI-powered functionality through a web interface.

The project also serves as a practical full-stack development project covering:

* Frontend development
* Backend API development
* AI API integration
* Middleware
* Authentication/security concepts
* Project structure and deployment practices

## 🔮 Future Improvements

* User authentication and profiles
* More ML models and AI features
* Improved recommendation algorithms
* Persistent user history
* Advanced comparison features
* Cloud deployment
* Improved UI/UX
* Automated testing
* Performance optimization

## 👨‍💻 Author

**Jeeva S**

GitHub: [@Sjeeva2910](https://github.com/Sjeeva2910)

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

**ML-Verse — Explore. Compare. Recommend. 🤖**
