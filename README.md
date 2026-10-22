# ⚡ Battery Management System (BMS) - Web Development Lab

A complete, full-stack industrial telemetry and diagnostics web application developed for **College Web Development Laboratory Experiment 6**. Built using **Node.js**, **Express.js**, **EJS Template Engine**, **CSS3 (Green/Black/White Theme)**, and the Node.js **File System (`fs`)** module.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features & Implemented Experiments](#-key-features--implemented-experiments)
3. [Folder Structure](#-folder-structure)
4. [Prerequisites & Installation](#-prerequisites--installation)
5. [Running the Application](#-running-the-application)
6. [Application Routes & API Endpoints](#-application-routes--api-endpoints)
7. [Screenshots Guide](#-screenshots-guide-for-lab-submission)
8. [Lab Experiments Breakdown](#-lab-experiments-breakdown)
9. [License & Credits](#-license--credits)

---

## 🌟 Project Overview

In industrial energy storage, electric vehicles (EVs), and solar installations, a **Battery Management System (BMS)** monitors critical pack parameters such as voltage, current, temperature, State of Charge (SoC), and cell balance to ensure safe and efficient operation.

This project simulates a real-time BMS telemetry system while demonstrating the core syllabus concepts of backend JavaScript engineering:
- Native HTTP web server vs. Express.js framework
- RESTful routing delivering HTML views and JSON APIs
- Asynchronous programming via the error-first callback pattern
- File System operations (`readFileSync`, `readFile`, `writeFile`, `appendFile`)
- Custom reusable CommonJS modules with mathematical calculations
- Server-side template rendering with EJS
- Modern, responsive dark-mode dashboard styled with green, black, and white aesthetics

---

## 🚀 Key Features & Implemented Experiments

| Exp # | Experiment Title | Implementation Details |
|:---:|:---|:---|
| **1** | **Native HTTP Server** | `server-http.js` using Node's built-in `http` module displaying *"Battery Management System Server Running"*. |
| **2** | **Basic Routing** | Routes for `/`, `/battery`, `/status`, and `/about`. Route `/status` delivers dynamic JSON telemetry. |
| **3** | **Callback Pattern** | `checkBatteryHealthWithCallback()` simulating health diagnosis with sequential callback execution. |
| **4** | **File Operations** | Synchronous (`readFileSync`) and Asynchronous (`readFile`, `writeFile`, `appendFile`) operations on `batteryData.json` and `logs.txt`. |
| **5** | **Custom Module** | `modules/batteryCalculator.js` providing `calculatePower()`, `calculateRemainingCapacity()`, and `calculateEfficiency()`. |
| **6** | **Express.js Framework** | Express server with static asset hosting via `express.static('public')` and modular routing. |
| **7** | **EJS Templating** | Dynamic views (`index.ejs`, `dashboard.ejs`, `about.ejs`) with partials (`header.ejs`, `navbar.ejs`, `footer.ejs`). |
| **8** | **Theme & Styling** | Sleek responsive dashboard featuring an electric green, deep black, and white color palette with glowing status gauges. |

---

## 📂 Folder Structure

```
nodejsexp6/
│
├── app.js                          # Main Express.js server & experiment orchestrator
├── server-http.js                  # Experiment 1: Native Node.js HTTP server
├── package.json                    # Project configuration, scripts, and dependencies
├── package-lock.json               # Locked dependency tree
├── README.md                       # Complete setup and user documentation
├── BMS_LAB_MANUAL.md               # Comprehensive Lab Manual (Aim, Theory, Flowcharts, 25 Viva Q&As)
│
├── modules/                        # Reusable backend custom modules
│   ├── batteryCalculator.js        # Exp 5: calculatePower, calculateRemainingCapacity, calculateEfficiency
│   └── fileManager.js              # Exp 3 & 4: fs operations and callback health check flow
│
├── data/                           # Data storage layer
│   ├── batteryData.json            # Exp 4 & 9: Real-world 16S LiFePO4 battery pack telemetry
│   └── logs.txt                    # Exp 4: BMS event audit log created via fs.appendFile()
│
├── routes/                         # Express route handlers
│   └── batteryRoutes.js            # Routes for /, /battery, /status, /about, and test APIs
│
├── views/                          # EJS view templates
│   ├── index.ejs                   # Home landing page with BMS overview
│   ├── dashboard.ejs               # Main telemetry dashboard with live experiment workbench
│   ├── about.ejs                   # Lab experiment details, theory, and architecture
│   ├── 404.ejs                     # Error handling view
│   └── partials/                   # Reusable EJS template components
│       ├── header.ejs              # HTML head, favicon, fonts, and CSS links
│       ├── navbar.ejs              # Navigation bar with active link state
│       └── footer.ejs              # Page footer with tech stack credits
│
└── public/                         # Static assets served via express.static()
    ├── css/
    │   └── style.css               # Green/black/white responsive design system & gauges
    ├── js/
    │   └── main.js                 # Interactive client controller (AJAX, dynamic refresh, calculator)
    └── images/
        └── bms-icon.svg            # Custom SVG vector icon for BMS
```

---

## 🛠️ Prerequisites & Installation

### Prerequisites
- **Node.js** (v16.0.0 or higher recommended; tested on v24.19.0)
- **npm** (v8.0.0 or higher; tested on v11.17.0)
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox)

### Installation Steps

1. Open your terminal or PowerShell and navigate to the project directory:
   ```bash
   cd c:\Users\aryah\Desktop\WPL\nodejsexp6
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

---

## 💻 Running the Application

### 1. Run the Main Express BMS Dashboard (Default)
```bash
npm start
```
- Main Application: [http://localhost:3000](http://localhost:3000)
- Battery Dashboard: [http://localhost:3000/battery](http://localhost:3000/battery)
- Status JSON API: [http://localhost:3000/status](http://localhost:3000/status)
- About & Lab Manual: [http://localhost:3000/about](http://localhost:3000/about)

### 2. Run the Native HTTP Server (Experiment 1)
To run the standalone Experiment 1 native HTTP server:
```bash
npm run start:http
```
- Access in browser: [http://localhost:3001](http://localhost:3001)
- Displays: *"Battery Management System Server Running"*

---

## 🌐 Application Routes & API Endpoints

| Endpoint | Method | Output Type | Description |
|:---|:---:|:---:|:---|
| `/` | `GET` | HTML (EJS) | Home landing page with system status and experiment cards. |
| `/battery` | `GET` | HTML (EJS) | Real-time Battery Dashboard displaying all required metrics and interactive test workbench. |
| `/status` | `GET` | JSON | Returns battery telemetry JSON (`batteryId`, `voltage`, `current`, `temperature`, `chargePercentage`, `batteryHealth`). |
| `/about` | `GET` | HTML (EJS) | Lab manual, theory, system architecture, and syllabus mappings. |
| `/api/callback` | `GET` | JSON | Triggers Experiment 3 callback flow and returns sequential execution log. |
| `/api/file-ops/test-all` | `GET` | JSON | Tests `readFileSync()`, `readFile()`, `writeFile()`, and `appendFile()`. |
| `/api/calculate` | `POST` | JSON | Custom module endpoint computing Power, Remaining Capacity, and Efficiency. |

---

## 📸 Screenshots Guide for Lab Submission

When preparing your laboratory submission or journal, capture the following screenshots:

1. **Terminal Startup Console Output**:
   - Run `npm start` in your terminal.
   - Capture the formatted ASCII banner, the custom module calculations output, and the Experiment 3 callback execution output.
2. **Home Page (`http://localhost:3000/`)**:
   - Capture the Hero section, live pack snapshot card, and the 6 experiment cards.
3. **Battery Dashboard (`http://localhost:3000/battery`)**:
   - Capture the top battery charge gauge (84%), the 8 telemetry metric cards (Voltage, Current, Temperature, Calculated Power, Charge Percentage, Battery Health, Remaining Capacity, Efficiency), and the 16-cell voltage matrix.
4. **Callback Demonstration Workbench**:
   - On `/battery`, scroll to the "Callback Pattern Health Check" section and click "Run Callback Health Check".
   - Capture the terminal window showing the sequence:
     ```
     > Checking Battery...
     > Battery Data Loaded...
     > Callback Executed
     > Battery Health: Good
     ```
5. **File System Operations Workbench**:
   - On `/battery`, click "Test All File Operations".
   - Capture the terminal log showing successful verification of `readFileSync`, `readFile`, `appendFile`, and `writeFile`.
6. **JSON Status Endpoint (`http://localhost:3000/status`)**:
   - Open `/status` in the browser or Postman and capture the formatted JSON response.
7. **Native HTTP Server (`http://localhost:3001/`)**:
   - Run `npm run start:http` and capture the web page showing *"Battery Management System Server Running"*.

---

## 🧪 Detailed Lab Manual

For the complete academic lab report containing **Aim**, **Objectives**, **Problem Statement**, **Theory**, **Algorithms**, **Mermaid Flowcharts**, **Code Explanation**, and **25 Viva Voce Questions with Answers**, refer to:
👉 [BMS_LAB_MANUAL.md](./BMS_LAB_MANUAL.md)

---

## 📜 License
Developed for academic laboratory coursework. Open source under the ISC License.
