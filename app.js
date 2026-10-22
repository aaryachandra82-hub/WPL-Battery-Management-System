/**
 * ============================================================================
 * BATTERY MANAGEMENT SYSTEM (BMS) - WEB DEVELOPMENT LAB EXPERIMENT 6
 * ============================================================================
 * Technologies: Node.js, Express.js, EJS, HTML5, CSS3, JavaScript, fs module
 * Features:
 *  - Native HTTP server comparison (server-http.js)
 *  - Express.js routing (/, /battery, /status, /about)
 *  - Asynchronous callback health check demonstration
 *  - File System operations (readFileSync, readFile, writeFile, appendFile)
 *  - Custom module integration (batteryCalculator.js)
 *  - Responsive green/black/white telemetry dashboard
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const batteryRoutes = require('./routes/batteryRoutes');
const batteryCalculator = require('./modules/batteryCalculator');
const fileManager = require('./modules/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. TEMPLATE ENGINE CONFIGURATION (EJS)
// ==========================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 2. MIDDLEWARE CONFIGURATION
// ==========================================
// Serve static assets (CSS, JS, Images) from the public/ folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 3. ROUTE REGISTRATION
// ==========================================
// Mount main BMS application routes
app.use('/', batteryRoutes);

// ==========================================
// 4. ERROR HANDLING MIDDLEWARE
// ==========================================
// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    currentPage: '404',
    url: req.originalUrl
  });
});

// 500 Internal Server Error Handler
app.use((err, req, res, next) => {
  console.error('[Internal Error]:', err.stack);
  res.status(500).render('404', {
    title: '500 - Server Error',
    currentPage: 'error',
    url: req.originalUrl,
    error: err.message
  });
});

// ==========================================
// 5. SERVER STARTUP & EXPERIMENT DEMO
// ==========================================
app.listen(PORT, () => {
  console.log('\n===============================================================');
  console.log('⚡ BATTERY MANAGEMENT SYSTEM (BMS) - LAB EXPERIMENT 6');
  console.log('===============================================================');
  console.log(`🚀 Server listening on: http://localhost:${PORT}`);
  console.log(`📊 Battery Dashboard:  http://localhost:${PORT}/battery`);
  console.log(`🔌 Status API (JSON):  http://localhost:${PORT}/status`);
  console.log(`ℹ️  About Page:         http://localhost:${PORT}/about`);
  console.log('---------------------------------------------------------------');

  // Demonstrate Custom Module execution (Experiment 5)
  console.log('\n[EXPERIMENT 5: Custom Module Demonstration]');
  const samplePower = batteryCalculator.calculatePower(51.84, 14.50);
  const sampleCapacity = batteryCalculator.calculateRemainingCapacity(100, 84);
  const sampleEfficiency = batteryCalculator.calculateEfficiency(800, samplePower);
  console.log(`  > Power (51.84V * 14.50A):              ${samplePower} W`);
  console.log(`  > Remaining Capacity (100Ah @ 84% SoC): ${sampleCapacity} Ah`);
  console.log(`  > Efficiency (Pin=800W, Pout=${samplePower}W): ${sampleEfficiency}%`);

  // Demonstrate Callback Pattern (Experiment 3)
  console.log('\n[EXPERIMENT 3: Callback Pattern Demonstration]');
  fileManager.checkBatteryHealthWithCallback((err, result) => {
    if (err) {
      console.error('  > Health Check Callback Failed:', err);
    } else {
      console.log(`  > Callback Result -> Health: ${result.health}, Charge: ${result.chargePercentage}%, Temp: ${result.temperature}°C`);
    }
    console.log('===============================================================\n');
  });
});

module.exports = app;
