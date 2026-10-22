# ⚡ Battery Management System (BMS Pro)

[![Node.js Version](https://img.shields.io/badge/Node.js-v16+-10b981?style=flat&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-00ff88?style=flat&logo=express)](https://expressjs.com/)
[![EJS Engine](https://img.shields.io/badge/Template-EJS-059669?style=flat)](https://ejs.co/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A full-stack industrial telemetry, cell monitoring, and automated diagnostics platform for rechargeable battery packs (LiFePO4 / NMC). Engineered with **Node.js**, **Express.js**, **EJS Templating**, and the native **File System (`fs`)** module.

---

## 🌟 Overview

In electric mobility (EVs), renewable solar storage (ESS), and industrial energy infrastructure, a **Battery Management System (BMS)** is the critical electronic core responsible for pack safety, thermal control, state estimation, and cell longevity.

**BMS Pro** provides:
- **Real-Time Telemetry Dashboard**: Visualizing pack voltage, current, individual cell voltages (16S series matrix), temperature, State of Charge (SoC), and State of Health (SoH).
- **RESTful Telemetry API**: Machine-readable JSON feeds (`/status`) for edge gateways and monitoring clients.
- **Automated Health Diagnostics**: Asynchronous health evaluation simulating real-time sensor limits and threshold alarms.
- **Dual Storage Engine**: Combines low-latency synchronous boot caching with asynchronous runtime audit logging and state persistence.
- **Electrical Calculation Engine**: Dynamic computation of Instantaneous Power ($P = V \times I$), Usable Capacity ($Ah$), and Power Conversion Efficiency ($\%$).
- **Standalone Heartbeat Daemon**: Native Node.js HTTP server for health probes and failover monitoring.

---

## 🚀 Key Features

| Subsystem | Architecture & Description |
|:---|:---|
| **Reactive Telemetry Dashboard** | Responsive dark-mode interface built with custom CSS, neon glowing gauges, and 16-cell balancing visualizer. |
| **Telemetry JSON Feed** | High-performance endpoint (`GET /status`) returning live pack metrics. |
| **Diagnostics Engine** | Asynchronous sensor evaluation checking voltage thresholds and thermal warnings. |
| **Audit Logging & Storage** | Persistent disk storage of pack metrics (`batteryData.json`) and timestamped event logging (`logs.txt`). |
| **Engineering Calculation Module** | Standalone mathematical calculation module (`modules/batteryCalculator.js`). |
| **Dual HTTP Daemon** | Full-featured Express application (`app.js`) paired with a lightweight native HTTP heartbeat (`server-http.js`). |

---

## 📂 Project Architecture

```
nodejsexp6/
│
├── app.js                          # Core Express.js application & middleware pipeline
├── server-http.js                  # Standalone native HTTP heartbeat service
├── package.json                    # Project configuration, scripts, and dependencies
├── README.md                       # System documentation
│
├── modules/                        # Business logic & calculation layer
│   ├── batteryCalculator.js        # Electrical power, capacity, and efficiency formulas
│   └── fileManager.js              # Persistence, audit logging & diagnostic routines
│
├── data/                           # Data storage layer
│   ├── batteryData.json            # 16S LiFePO4 pack telemetry store
│   └── logs.txt                    # System audit trail and event log
│
├── routes/                         # REST & View routing
│   └── batteryRoutes.js            # Route controllers for views and JSON endpoints
│
├── views/                          # EJS templates
│   ├── index.ejs                   # System landing & status overview
│   ├── dashboard.ejs               # Real-time telemetry dashboard & test workbench
│   ├── about.ejs                   # System architecture and technical specifications
│   ├── 404.ejs                     # Error fallback view
│   └── partials/                   # Reusable UI partials
│       ├── header.ejs              # Head meta tags and stylesheets
│       ├── navbar.ejs              # Main navigation bar
│       └── footer.ejs              # Footer layout
│
└── public/                         # Static web assets
    ├── css/
    │   └── style.css               # Modern green/black industrial theme & layout
    ├── js/
    │   └── main.js                 # Dynamic client-side controller (AJAX, refresh, calculations)
    └── images/
        └── bms-icon.svg            # Custom BMS vector logo
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/aaryachandra82-hub/WPL-Battery-Management-System.git
   cd WPL-Battery-Management-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the platform:
   ```bash
   npm start
   ```

---

## 🌐 Endpoints & Usage

| Endpoint | Method | Format | Purpose |
|:---|:---:|:---:|:---|
| `/` | `GET` | HTML | System Overview & Quick Pack Status |
| `/battery` | `GET` | HTML | Real-time Telemetry Dashboard & Diagnostics Workbench |
| `/status` | `GET` | JSON | Machine-readable Telemetry Feed |
| `/about` | `GET` | HTML | Architecture & Engineering Specifications |
| `/api/callback` | `GET` | JSON | Triggers Asynchronous Diagnostic Health Routine |
| `/api/file-ops/test-all` | `GET` | JSON | Verifies Storage Persistence & Audit Log Engine |
| `/api/calculate` | `POST` | JSON | Computes Power, Usable Capacity, and Efficiency |

### Standalone Heartbeat Daemon
To run the lightweight native HTTP server on port 3001:
```bash
npm run heartbeat
```
- Endpoint: [http://localhost:3001](http://localhost:3001)
- Displays: `"Battery Management System Server Running"`

---

## 📊 Sample Telemetry Output (`GET /status`)

```json
{
  "batteryId": "BMS-EV-7048",
  "voltage": 51.84,
  "current": 14.5,
  "temperature": 29.4,
  "chargePercentage": 84,
  "batteryHealth": "Good",
  "calculatedPowerWatts": 751.68,
  "chargingStatus": "Discharging",
  "lastUpdated": "2026-10-22T18:10:00.000Z"
}
```

---

## 🧪 Electrical Engineering Formulas

- **Instantaneous Electrical Power ($P$)**:
  $$P = V \times I \quad \text{(Watts)}$$
- **Remaining Usable Capacity ($Ah$)**:
  $$\text{Remaining Capacity} = \text{Nominal Capacity} \times \left(\frac{\text{SoC}}{100}\right)$$
- **Power Conversion Efficiency ($\eta$)**:
  $$\eta = \left(\frac{P_{out}}{P_{in}}\right) \times 100 \quad (\%)$$

---

## 📄 License
Released under the [ISC License](LICENSE).
