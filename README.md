# YantraBhashi Compiler

## NOTE: A technical issue with the original repository prevents us from pushing to the main branch. Due to strict time constraints, we determined the most efficient path was to create a new Git repository for this project rather than spending time debugging the problem. Links for both the original and new repositories are provided below.

A web-based compiler and interpreter for YantraBhashi, a custom programming language with Telugu-inspired keywords. Built using the MERN stack with comprehensive syntax validation, semantic analysis, and real-time code execution capabilities.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Language Specification](#language-specification)
- [Design Decisions](#design-decisions)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Overview

YantraBhashi is a custom programming language that uses Telugu-inspired keywords to make programming more accessible to native Telugu speakers. The compiler provides a complete development environment with real-time validation, and execution capabilities.

### Key Components:
- **Frontend**: React.js-based IDE
- **Backend**: Node.js/Express.js API server with MongoDB integration
- **Validator**: Comprehensive syntax and semantic analysis engine
- **Interpreter**: Runtime execution engine with scope management
- **Database**: MongoDB for user management and code storage

## Architecture (Solution Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────┬───────────────────┬───────────────────────────┤
│   Code Editor   │   Output Panel    │      Control Panel        │
│                 │   (Results)       │   (Run/Save/Load)         │
└─────────────────┴───────────────────┴───────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Node.js/Express)                   │
├─────────────────┬───────────────────┬───────────────────────────┤
│  Authentication │   Code Execution  │    Data Management        │
│     Routes      │      Engine       │       Routes              │
└─────────────────┴───────────────────┴───────────────────────────┘
                              │
                              │ Database Queries
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB Database                         │
├──────────────────────────────┬──────────────────────────────────┤
│     Users                    │            Code Submissions      │    
│  Collection                  │            Collection            │    
└──────────────────────────────┴──────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React.js** (v18.x) - UI framework

### Backend
- **Node.js** (v16.x+) - Runtime environment
- **Express.js** (v4.x) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Development Tools
- **Prettier** - Code formatting

## Features

### Core Language Features
- **Variable Declaration**: `PADAM variable:TYPE = value;`
- **Data Types**: `ANKHE` (integers), `VARTTAI` (strings)
- **Output**: `CHATIMPU(expression);`
- **Input**: `CHEPPU(variable);`
- **Conditionals**: `ELAITHE (condition) [ ... ] ALAITHE [ ... ]`
- **Loops**: `MALLI-MALLI (init; condition; update) [ ... ]`

### Compiler Features
- **Syntax Validation**: Real-time syntax error detection
- **Semantic Analysis**: Type checking and scope validation
- **Runtime Execution**: Interactive code execution
- **Error Reporting**: Detailed error messages with line numbers
- **Scope Management**: Nested block scope handling

### Web Application Features
- **User Authentication**: Registration and login system
- **Real-time Validation**: Instant feedback on code errors
- **Code Execution**: Run code and view output in real-time

## Installation & Setup

### Prerequisites
- Node.js (v16.0 or higher)
- MongoDB (v4.4 or higher)
- npm package manager

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/jainvinit0302/YantraBhashi_Team_4_SSD.git
cd YantraBhashi_Team_4_SSD
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb+srv://logicviper3:yxdyg2MO1UBPmBSq@clustertest.hf2rhni.mongodb.net/YantraBhasiDB?retryWrites=true&w=majority&appName=ClusterTest
PORT=4000
```

4. **Start MongoDB**
```bash
# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows (if installed as service)
net start MongoDB
```

5. **Start the backend server**
```bash
npm run dev
# or for production
npm start
```

The backend server will start on `http://localhost:4000`

### Frontend Setup

1. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

2. **Start the development server**
```bash
npm start
```

The frontend will start on `http://localhost:3000`

### Database Setup

MongoDB collections will be automatically created when the application runs. The main collections are:

- **users**: User account information
- **submissions**: Code submissions and execution history

## Project Structure

```
Directory structure:
└── YantraBhashi_Team_4_SSD/
    ├── README.md
    ├── backend/
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── models/
    │   │   ├── Submission.js
    │   │   └── User.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes/
    │   │   ├── auth.js
    │   │   └── submissions.js
    │   └── server.js
    ├── frontend/
    │   ├── README.md
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public/
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── logo192.png
    │   │   ├── logo512.png
    │   │   ├── manifest.json
    │   │   └── robots.txt
    │   └── src/
    │       ├── App.css
    │       ├── App.js.js
    │       ├── App.test.js
    │       ├── components/
    │       │   ├── auth/
    │       │   │   ├── LoginForm.js
    │       │   │   └── SignupForm.js
    │       │   ├── common/
    │       │   │   └── Header.js
    │       │   ├── compiler/
    │       │   │   ├── CodeEditor.js
    │       │   │   ├── CompilerInterface.js
    │       │   │   └── OutputPanel.js
    │       │   └── dashboard/
    │       │       ├── Analytics.js
    │       │       ├── Header.js
    │       │       ├── InstructorDashboard.js
    │       │       ├── SubmissionDetails.js
    │       │       └── SubmissionsList.js
    │       ├── index.css
    │       ├── index.js.js
    │       ├── logo.svg
    │       ├── reportWebVitals.js
    │       ├── services/
    │       │   ├── interpretor.js
    │       │   ├── mockAPI.js
    │       │   └── validator.js
    │       ├── setupTests.js
    │       ├── styles/
    │       │   └── components.css
    │       └── utils/
    │           └── constants.js
    ├── package-lock.json
    └── package.json
```

## Language Specification

### Data Types
- **ANKHE**: Integer type for numerical values
- **VARTTAI**: String type for textual data

### Syntax Rules

#### Variable Declaration
```yantrabhashi
PADAM variable_name:DATA_TYPE = initial_value;
PADAM variable_name:DATA_TYPE;  // Declaration without initialization
```

#### Input/Output Operations
```yantrabhashi
CHATIMPU(expression);           // Output statement
CHEPPU(variable_name);          // Input statement
```

#### Control Structures
```yantrabhashi
// Conditional statements
ELAITHE (condition) [
    // if block
] ALAITHE [
    // else block (optional)
]

// Loop statements
MALLI-MALLI (PADAM i:ANKHE = 0; i < 10; i = i + 1) [
    // loop body
]
```

#### Expressions and Operations
- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Assignment: `variable = expression;`

### Example Program
```yantrabhashi
# Calculate sum of first 10 natural numbers
PADAM total:ANKHE = 0;
PADAM message:VARTTAI = "Sum of first 10 numbers is: ";

MALLI-MALLI (PADAM i:ANKHE = 1; i <= 10; i = i + 1) [
    total = total + i;
]

CHATIMPU(message);
CHATIMPU(total);
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email"
  }
}
```

### Code Execution Endpoints

#### POST /api/code/submit
Submit code for validation and execution.


**Request Body:**
```json
{
  "code": "string",
  "inputs": ["string"],
  "userId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "isValid": true,
    "output": "program_output",
    "errors": [],
    "executionTime": 150
  }
}
```

#### GET /api/code/submissions
Get user's code submission history.

**Response:**
```json
{
  "success": true,
  "submissions": [
    {
      "id": "submission_id",
      "code": "user_code",
      "output": "execution_result",
      "timestamp": "2024-01-01T00:00:00Z",
      "status": "success"
    }
  ]
}
```

### User Management Endpoints


**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "createdAt": "2024-01-01T00:00:00Z",
    "submissionCount": 25
  }
}
```

## Contributing

### Development Workflow

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** with appropriate tests
5. **Run the test suite** to ensure everything works
6. **Submit a pull request** with detailed description

### Code Standards

- **JavaScript**: Follow ESLint configuration
- **React**: Use functional components with hooks
- **CSS**: CSS for style
- **Commits**: Use conventional commit messages
- **Documentation**: Update README for new features

### Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run integration tests
npm run test:integration
```

### Building for Production

```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm run start:prod
```
