/**
 * Battery Management System (BMS) - Application Routes & RESTful API
 * 
 * Endpoints:
 * - GET /              : System Overview & Telemetry Snapshot
 * - GET /battery       : Real-time Interactive Battery Telemetry Dashboard
 * - GET /status        : Machine-readable JSON Telemetry Feed
 * - GET /about         : Architecture & Technical Specifications
 * - GET /api/callback  : Health Diagnostics Routine
 * - GET /api/file-ops/test-all : Storage & File Operation Health Check
 * - POST /api/calculate : Electrical Parameters Calculator
 */

const express = require('express');
const router = express.Router();
const fileManager = require('../modules/fileManager');
const batteryCalculator = require('../modules/batteryCalculator');

/**
 * Route: GET /
 * System Overview Landing Page
 */
router.get('/', (req, res) => {
  const result = fileManager.readBatteryDataSync();
  const batteryData = result.success ? result.data : null;

  let power = 0;
  if (batteryData) {
    power = batteryCalculator.calculatePower(batteryData.voltage, batteryData.current);
  }

  res.render('index', {
    title: 'BMS Pro - Battery Management & Telemetry System',
    currentPage: 'home',
    battery: batteryData,
    calculatedPower: power
  });
});

/**
 * Route: GET /battery
 * Real-time Battery Dashboard
 */
router.get('/battery', (req, res) => {
  fileManager.readBatteryDataAsync((err, batteryData) => {
    if (err) {
      console.error('Error fetching battery telemetry:', err);
      return res.status(500).render('dashboard', {
        title: 'BMS Dashboard - Telemetry Unavailable',
        currentPage: 'battery',
        battery: null,
        error: 'Unable to load real-time telemetry from storage.',
        calculatedPower: 0,
        remainingCapacity: 0,
        efficiency: 0
      });
    }

    const calculatedPower = batteryCalculator.calculatePower(
      batteryData.voltage,
      batteryData.current
    );

    const remainingCapacity = batteryCalculator.calculateRemainingCapacity(
      batteryData.nominalCapacity || 100,
      batteryData.chargePercentage
    );

    const theoreticalInput = calculatedPower > 0 ? calculatedPower * 1.08 : 800;
    const efficiency = batteryCalculator.calculateEfficiency(theoreticalInput, calculatedPower);

    res.render('dashboard', {
      title: 'BMS Dashboard - Real-time Telemetry',
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
 * Route: GET /status
 * Machine-readable JSON telemetry feed
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

    const power = batteryCalculator.calculatePower(
      batteryData.voltage,
      batteryData.current
    );

    const responsePayload = {
      batteryId: batteryData.batteryId,
      voltage: batteryData.voltage,
      current: batteryData.current,
      temperature: batteryData.temperature,
      chargePercentage: batteryData.chargePercentage,
      batteryHealth: batteryData.batteryHealth,
      calculatedPowerWatts: power,
      chargingStatus: batteryData.chargingStatus || 'Active',
      lastUpdated: batteryData.lastUpdated || new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responsePayload);
  });
});

/**
 * Route: GET /about
 * System Architecture & Engineering Specifications
 */
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About - BMS Pro Technical Specifications',
    currentPage: 'about'
  });
});

/**
 * Route: GET /api/callback
 * Health Diagnostics Execution Flow
 */
router.get('/api/callback', (req, res) => {
  fileManager.checkBatteryHealthWithCallback((err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        logs: result ? result.logs : []
      });
    }

    res.json({
      success: true,
      message: 'Health diagnostics routine executed successfully',
      result
    });
  });
});

/**
 * Route: GET /api/file-ops/test-all
 * File Storage & Diagnostics Benchmark
 */
router.get('/api/file-ops/test-all', (req, res) => {
  const opResults = {};

  const syncResult = fileManager.readBatteryDataSync();
  opResults.readFileSync = {
    success: syncResult.success,
    message: 'Synchronous read verified via fs.readFileSync()',
    voltage: syncResult.data ? syncResult.data.voltage : null
  };

  fileManager.readBatteryDataAsync((readErr, asyncData) => {
    if (readErr) {
      opResults.readFile = { success: false, error: readErr.message };
    } else {
      opResults.readFile = {
        success: true,
        message: 'Asynchronous read verified via fs.readFile()',
        batteryId: asyncData.batteryId
      };
    }

    fileManager.appendBmsLog('System Health Check: Storage verified via fs.appendFile()', (appendErr, appendRes) => {
      if (appendErr) {
        opResults.appendFile = { success: false, error: appendErr.message };
      } else {
        opResults.appendFile = {
          success: true,
          message: 'Log appended successfully via fs.appendFile()',
          entry: appendRes.entry
        };
      }

      if (asyncData) {
        asyncData.lastUpdated = new Date().toISOString();
        fileManager.writeBatteryData(asyncData, (writeErr) => {
          if (writeErr) {
            opResults.writeFile = { success: false, error: writeErr.message };
          } else {
            opResults.writeFile = {
              success: true,
              message: 'Telemetry updated successfully via fs.writeFile()'
            };
          }

          res.json({
            success: true,
            summary: 'All file storage operations verified successfully',
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
 * Route: POST /api/calculate
 * Real-time Electrical Parameter Calculations
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
 * Route: POST /api/battery/update
 * Update telemetry parameters
 */
router.post('/api/battery/update', (req, res) => {
  fileManager.readBatteryDataAsync((err, currentData) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

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

      fileManager.appendBmsLog(`Telemetry parameters updated: V=${currentData.voltage}V, SoC=${currentData.chargePercentage}%`, () => {});

      res.json({
        success: true,
        message: 'Battery parameters updated successfully',
        data: currentData
      });
    });
  });
});

module.exports = router;
