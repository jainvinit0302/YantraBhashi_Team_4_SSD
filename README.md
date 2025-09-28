# YantraBhashi Compiler

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

## Architecture

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
yantrabhashi-compiler/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── auth.js              # Authentication config
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   └── codeController.js    # Code execution logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Submission.js        # Code submission schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User routes
│   │   └── code.js              # Code execution routes
│   ├── services/
│   │   ├── validator.js         # YantraBhashi validator
│   │   └── interpreter.js       # YantraBhashi interpreter
│   ├── utils/
│   │   ├── logger.js            # Logging utility
│   │   └── responses.js         # API response helpers
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Main server file
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── compiler/
│   │   │   │   ├── CompilerInterface.js
│   │   │   │   ├── CodeEditor.js
│   │   │   │   └── OutputPanel.js
│   │   │   └── common/
│   │   │       ├── Header.js
│   │   │       └── Sidebar.js
│   │   ├── services/
│   │   │   ├── api.js           # API service
│   │   │   ├── auth.js          # Authentication service
│   │   │   ├── validator.js     # Client-side validator
│   │   │   └── interpreter.js   # Client-side interpreter
│   │   ├── styles/
│   │   │   ├── components.css   # Component styles
│   │   │   └── globals.css      # Global styles
│   │   ├── utils/
│   │   │   ├── constants.js     # Application constants
│   │   │   └── helpers.js       # Utility functions
│   │   ├── App.js               # Main application component
│   │   └── index.js             # Application entry point
│   ├── .env                     # Frontend environment variables
│   └── package.json
├── README.md
└── package.json                 # Root package.json for scripts
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

## Design Decisions

### Architecture Choices

#### 1. MERN Stack Selection
**Decision**: Use MongoDB, Express.js, React.js, and Node.js
**Rationale**: 
- **JavaScript Ecosystem**: Single language across full stack reduces complexity
- **Rapid Development**: Rich ecosystem enables faster development cycles
- **Scalability**: Each component scales independently
- **Community Support**: Extensive documentation and community resources

#### 2. Client-Side Validation and Execution
**Decision**: Implement both validator and interpreter on the frontend
**Rationale**:
- **Real-time Feedback**: Immediate syntax error detection without server roundtrips
- **Reduced Server Load**: Computational work distributed to client
- **Offline Capability**: Basic functionality works without internet connection
- **Better UX**: Instantaneous response to user input

#### 3. Dual Validation System
**Decision**: Implement validation both on client and server
**Rationale**:
- **Security**: Server-side validation prevents malicious code execution
- **Performance**: Client-side validation provides immediate feedback
- **Reliability**: Redundancy ensures code quality
- **User Experience**: Best of both worlds approach

### Language Design Choices

#### 1. Telugu-Inspired Keywords
**Decision**: Use Telugu-derived keywords instead of English
**Rationale**:
- **Cultural Relevance**: Makes programming more accessible to Telugu speakers
- **Educational Value**: Reduces language barrier in programming education
- **Unique Identity**: Differentiates from existing programming languages

#### 2. Strong Type System
**Decision**: Implement strict type checking with only two basic types
**Rationale**:
- **Simplicity**: Easy to understand for beginners
- **Error Prevention**: Catches type-related errors at compile time
- **Educational Focus**: Teaches type safety concepts
- **Performance**: Simpler type system enables faster execution

#### 3. Explicit Scope Management
**Decision**: Implement block-scoped variables with explicit scope tracking
**Rationale**:
- **Predictability**: Clear variable lifetime and accessibility rules
- **Educational Value**: Teaches scope concepts explicitly
- **Error Prevention**: Prevents common scope-related errors
- **Memory Management**: Enables proper cleanup of variables

### Implementation Decisions

#### 1. Comprehensive Error Reporting
**Decision**: Implement detailed error messages with line numbers and context
**Rationale**:
- **Learning Aid**: Helps users understand and fix errors
- **Developer Experience**: Reduces debugging time
- **Educational Value**: Teaches proper error handling
- **Professional Standard**: Matches expectations from modern IDEs

#### 2. Real-time vs. Efficiency
- **Trade-off**: Real-time validation vs. computational efficiency
- **Decision**: Optimize for real-time feedback
- **Impact**: Higher client-side computational load but better UX

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

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

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

**Headers:**
```
Authorization: Bearer jwt_token_here
```

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

#### GET /api/users/profile
Get current user profile information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

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

## License

This project is licensed under the IIIT License. See the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions:
- **Issues**: [GitHub Issues](https://github.com/your-username/yantrabhashi-compiler/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/yantrabhashi-compiler/discussions)
- **Email**: your-email@domain.com

## Acknowledgments

- MongoDB team for the excellent database system
- React team for the powerful UI framework
- Telugu language community for inspiration