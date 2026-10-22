/**
 * Routes: batteryRoutes.js
 * Handles all Express.js routing for pages and APIs.
 * 
 * Experiment 2: Basic Routing (/, /battery, /status, /about)
 * Experiment 3: Callback Demonstration (/api/callback)
 * Experiment 4: File System operations (/api/file-ops/*)
 * Experiment 5: Custom Module calculator (/api/calculate)
 */

const express = require('express');
const router = express.Router();
const fileManager = require('../modules/fileManager');
const batteryCalculator = require('../modules/batteryCalculator');

/**
 * Route 1: GET /
 * Home Page (Rendered using EJS)
 */
router.get('/', (req, res) => {
  // Read current battery data to show summary on home page
  const result = fileManager.readBatteryDataSync();
  const batteryData = result.success ? result.data : null;

  let power = 0;
  if (batteryData) {
    power = batteryCalculator.calculatePower(batteryData.voltage, batteryData.current);
  }

  res.render('index', {
    title: 'BMS Pro - Battery Management System',
    currentPage: 'home',
    battery: batteryData,
    calculatedPower: power
  });
});

/**
 * Route 2: GET /battery
 * Battery Dashboard Page (Rendered using EJS)
 * Displays: Battery ID, Voltage, Current, Temperature, Charge %, Battery Health, Calculated Power
 */
router.get('/battery', (req, res) => {
  // Use fileManager to read batteryData.json asynchronously
  fileManager.readBatteryDataAsync((err, batteryData) => {
    if (err) {
      console.error('Error fetching battery data for dashboard:', err);
      return res.status(500).render('dashboard', {
        title: 'BMS Dashboard - Error',
        currentPage: 'battery',
        battery: null,
        error: 'Unable to load battery telemetry data from batteryData.json.',
        calculatedPower: 0,
        remainingCapacity: 0,
        efficiency: 0
      });
    }

    // Calculate metrics using custom module (Experiment 5)
    const calculatedPower = batteryCalculator.calculatePower(
      batteryData.voltage,
      batteryData.current
    );

    const remainingCapacity = batteryCalculator.calculateRemainingCapacity(
      batteryData.nominalCapacity || 100,
      batteryData.chargePercentage
    );

    // Sample efficiency comparison: charging vs output power
    const theoreticalInput = calculatedPower > 0 ? calculatedPower * 1.08 : 800;
    const efficiency = batteryCalculator.calculateEfficiency(theoreticalInput, calculatedPower);

    res.render('dashboard', {
      title: 'BMS Dashboard - Live Telemetry',
      currentPage: 'battery',
      battery: batteryData,
      calculatedPower,
      remainingCapacity,
      efficiency,
      error: null
    });
  });
});

/**
 * Route 3: GET /status
 * Returns Battery JSON payload (Experiment 2 requirement)
 * Must include:
 * - batteryId
 * - voltage
 * - current
 * - temperature
 * - chargePercentage
 * - batteryHealth
 */
router.get('/status', (req, res) => {
  fileManager.readBatteryDataAsync((err, batteryData) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to read battery status data',
        timestamp: new Date().toISOString()
      });
    }

    // Calculate real-time power using custom module
    const power = batteryCalculator.calculatePower(
      batteryData.voltage,
      batteryData.current
    );

    // Exact fields required by specification
    const responsePayload = {
      batteryId: batteryData.batteryId,
      voltage: batteryData.voltage,
      current: batteryData.current,
      temperature: batteryData.temperature,
      chargePercentage: batteryData.chargePercentage,
      batteryHealth: batteryData.batteryHealth,
      // Additional useful telemetry
      calculatedPowerWatts: power,
      chargingStatus: batteryData.chargingStatus || 'Active',
      lastUpdated: batteryData.lastUpdated || new Date().toISOString()
    };

    // Return standard JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responsePayload);
  });
});

/**
 * Route 4: GET /about
 * About Page (Rendered using EJS)
 */
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About - BMS Lab Project',
    currentPage: 'about'
  });
});

/**
 * Route 5: GET /api/callback
 * Experiment 3 Callback Demonstration API
 * Executes callback flow and returns execution sequence
 */
router.get('/api/callback', (req, res) => {
  console.log('\n--- [EXPERIMENT 3] Initiating Callback Health Check ---');
  fileManager.checkBatteryHealthWithCallback((err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        logs: result ? result.logs : []
      });
    }

    console.log('--- [EXPERIMENT 3] Callback Health Check Completed ---\n');
    res.json({
      success: true,
      message: 'Callback pattern executed successfully',
      result
    });
  });
});

/**
 * Route 6: GET /api/file-ops/test-all
 * Experiment 4 Demonstration: runs readFileSync, readFile, writeFile, appendFile
 */
router.get('/api/file-ops/test-all', (req, res) => {
  const opResults = {};

  // 1. readFileSync
  const syncResult = fileManager.readBatteryDataSync();
  opResults.readFileSync = {
    success: syncResult.success,
    message: 'Synchronous read completed via fs.readFileSync()',
    voltage: syncResult.data ? syncResult.data.voltage : null
  };

  // 2. readFile
  fileManager.readBatteryDataAsync((readErr, asyncData) => {
    if (readErr) {
      opResults.readFile = { success: false, error: readErr.message };
    } else {
      opResults.readFile = {
        success: true,
        message: 'Asynchronous read completed via fs.readFile()',
        batteryId: asyncData.batteryId
      };
    }

    // 3. appendFile
    fileManager.appendBmsLog('Automated Test: Telemetry verified by fs.appendFile()', (appendErr, appendRes) => {
      if (appendErr) {
        opResults.appendFile = { success: false, error: appendErr.message };
      } else {
        opResults.appendFile = {
          success: true,
          message: 'Log appended successfully via fs.appendFile()',
          entry: appendRes.entry
        };
      }

      // 4. writeFile (writes back current data with refreshed timestamp)
      if (asyncData) {
        asyncData.lastUpdated = new Date().toISOString();
        fileManager.writeBatteryData(asyncData, (writeErr, writeRes) => {
          if (writeErr) {
            opResults.writeFile = { success: false, error: writeErr.message };
          } else {
            opResults.writeFile = {
              success: true,
              message: 'Data successfully updated via fs.writeFile()'
            };
          }

          res.json({
            success: true,
            summary: 'All 4 file system operations demonstrated successfully',
            operations: opResults
          });
        });
      } else {
        res.json({ success: false, operations: opResults });
      }
    });
  });
});

/**
 * Route 7: POST /api/calculate
 * Experiment 5: Custom Module calculator endpoint
 */
router.post('/api/calculate', (req, res) => {
  const { voltage, current, capacity, chargePercentage, inputPower, outputPower } = req.body;

  const power = batteryCalculator.calculatePower(voltage, current);
  const remainingCapacity = batteryCalculator.calculateRemainingCapacity(capacity, chargePercentage);
  const efficiency = batteryCalculator.calculateEfficiency(inputPower, outputPower);

  res.json({
    success: true,
    calculated: {
      power: `${power} W`,
      remainingCapacity: `${remainingCapacity} Ah`,
      efficiency: `${efficiency} %`
    }
  });
});

/**
 * Route 8: POST /api/battery/update
 * Update telemetry data dynamically (tests fs.writeFile)
 */
router.post('/api/battery/update', (req, res) => {
  fileManager.readBatteryDataAsync((err, currentData) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    // Update with requested values or randomly oscillate within safe bounds
    if (req.body.voltage) currentData.voltage = parseFloat(req.body.voltage);
    if (req.body.current) currentData.current = parseFloat(req.body.current);
    if (req.body.temperature) currentData.temperature = parseFloat(req.body.temperature);
    if (req.body.chargePercentage) currentData.chargePercentage = parseInt(req.body.chargePercentage, 10);
    if (req.body.batteryHealth) currentData.batteryHealth = req.body.batteryHealth;

    currentData.lastUpdated = new Date().toISOString();

    fileManager.writeBatteryData(currentData, (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ success: false, error: writeErr.message });
      }

      fileManager.appendBmsLog(`Battery parameters updated: V=${currentData.voltage}V, SoC=${currentData.chargePercentage}%`, () => {});

      res.json({
        success: true,
        message: 'Battery parameters updated and saved via fs.writeFile()',
        data: currentData
      });
    });
  });
});

module.exports = router;
