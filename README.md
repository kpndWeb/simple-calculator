# simple-calculator
A simple web based calculator using Node.js, Express and PostgreSQL
# 🧮 Simple Calculator Web App

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-blue)

A clean, responsive web-based calculator built with modern full-stack technologies. Designed for learning, extension (e.g., history logging, user accounts), and as a foundation for more complex applications like POS systems.

> ✅ **Frontend**: HTML5, CSS3, Vanilla JavaScript (keyboard & mouse support)  
> ✅ **Backend**: Node.js + Express.js (REST API ready)  
> ✅ **Database**: PostgreSQL-ready (schema & logging module planned)  
> ✅ **DevOps**: Git-enabled, easy to deploy

---

## 🚀 Features

- Basic arithmetic: `+`, `-`, `×`, `÷`
- Decimal support & operator precedence (`2 + 3 × 4 = 14`)
- Keyboard shortcuts (numbers, `+−×÷`, `Enter`, `Backspace`, `Esc`)
- Clean, mobile-responsive UI
- RESTful `/api/calculate` endpoint (for secure/future integrations)
- PostgreSQL integration *planned* for calculation history logging

---

## 🛠️ Tech Stack

| Layer         | Technology        |
|---------------|-------------------|
| **Frontend**  | HTML5, CSS3, Vanilla JS |
| **Backend**   | Node.js, Express.js |
| **Database**  | PostgreSQL (*optional, pending implementation*) |
| **DevOps**    | Git, GitHub, Nodemon |

---

## 📦 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- `npm` (comes with Node)
- *(Optional)* PostgreSQL 14+ (for future logging feature)

### Installation
```bash
# Clone the repo
git clone https://github.com/your-username/simple-calculator-app.git
cd simple-calculator-app

# Install dependencies
npm install

# Start development server
npm run dev