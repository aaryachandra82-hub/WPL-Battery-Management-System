/**
 * ============================================================================
 * BATTERY MANAGEMENT SYSTEM (BMS) - TELEMETRY & DIAGNOSTICS PLATFORM
 * ============================================================================
 * Technologies: Node.js, Express.js, EJS, HTML5, CSS3, JavaScript, fs module
 * Features:
 *  - Real-time battery telemetry dashboard
 *  - Machine-readable JSON telemetry feed (/status)
 *  - Automated health diagnostics engine
 *  - Persistent data storage & event audit logging (fs module)
 *  - Custom engineering calculation engine (batteryCalculator.js)
 *  - Responsive industrial dark-mode interface
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const batteryRoutes = require('./routes/batteryRoutes');
const batteryCalculator = require('./modules/batteryCalculator');
const fileManager = require('./modules/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Template engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from public/ folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse form inputs and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Register application routes
app.use('/', batteryRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: '404 - Not Found',
    currentPage: '404',
    url: req.originalUrl
  });
});

// 500 Server Error Handler
app.use((err, req, res, next) => {
  console.error('[Internal Error]:', err.stack);
  res.status(500).render('404', {
    title: '500 - Server Error',
    currentPage: 'error',
    url: req.originalUrl,
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('\n===============================================================');
  console.log('⚡ BATTERY MANAGEMENT SYSTEM (BMS) - CORE SERVICE');
  console.log('===============================================================');
  console.log(`🚀 Web Interface:     http://localhost:${PORT}`);
  console.log(`📊 Live Dashboard:    http://localhost:${PORT}/battery`);
  console.log(`🔌 Telemetry API:     http://localhost:${PORT}/status`);
  console.log(`ℹ️  System Overview:   http://localhost:${PORT}/about`);
  console.log('---------------------------------------------------------------');

  // Verify calculation engine
  const samplePower = batteryCalculator.calculatePower(51.84, 14.50);
  const sampleCapacity = batteryCalculator.calculateRemainingCapacity(100, 84);
  const sampleEfficiency = batteryCalculator.calculateEfficiency(800, samplePower);
  console.log(`[Telemetry Engine Initialized]`);
  console.log(`  > Nominal Power:        ${samplePower} W`);
  console.log(`  > Remaining Capacity:   ${sampleCapacity} Ah`);
  console.log(`  > Operating Efficiency: ${sampleEfficiency}%`);

  // Initial diagnostics routine
  console.log(`[Running Initial Battery Diagnostics...]`);
  fileManager.checkBatteryHealthWithCallback((err, result) => {
    if (err) {
      console.error('  > Health Check Failed:', err);
    } else {
      console.log(`  > Diagnostic Result -> Health: ${result.health}, SoC: ${result.chargePercentage}%, Temp: ${result.temperature}°C`);
    }
    console.log('===============================================================\n');
  });
});

module.exports = app;
