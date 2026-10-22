/**
 * Battery Management System (BMS) - Data Access & Storage Layer
 * 
 * Handles persistent telemetry storage and asynchronous diagnostic workflows:
 * 1. Synchronous & Asynchronous reads on batteryData.json
 * 2. Asynchronous updates and writes
 * 3. Event logging and audit trailing in logs.txt
 * 4. Asynchronous battery health diagnosis routine
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'batteryData.json');
const LOG_FILE = path.join(__dirname, '..', 'data', 'logs.txt');

/**
 * Reads battery telemetry synchronously.
 * 
 * @returns {Object} Parsed JSON battery data
 */
function readBatteryDataSync() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(rawData);
    return { success: true, data: parsedData, method: 'readFileSync' };
  } catch (error) {
    console.error('[Storage] Error reading telemetry synchronously:', error.message);
    return { success: false, error: error.message, method: 'readFileSync' };
  }
}

/**
 * Reads battery telemetry asynchronously using error-first callback.
 * 
 * @param {Function} callback - Callback function (err, data)
 */
function readBatteryDataAsync(callback) {
  fs.readFile(DATA_FILE, 'utf-8', (err, rawData) => {
    if (err) {
      console.error('[Storage] Error reading telemetry asynchronously:', err.message);
      return callback(err, null);
    }
    try {
      const parsedData = JSON.parse(rawData);
      return callback(null, parsedData);
    } catch (parseErr) {
      console.error('[Storage] Telemetry JSON parse error:', parseErr.message);
      return callback(parseErr, null);
    }
  });
}

/**
 * Persists updated battery pack telemetry to disk.
 * 
 * @param {Object} updatedData - Object containing updated battery metrics
 * @param {Function} callback - Callback function (err, result)
 */
function writeBatteryData(updatedData, callback) {
  const jsonString = JSON.stringify(updatedData, null, 2);
  fs.writeFile(DATA_FILE, jsonString, 'utf-8', (err) => {
    if (err) {
      console.error('[Storage] Error saving telemetry:', err.message);
      return callback(err, null);
    }
    return callback(null, {
      message: 'Battery telemetry saved successfully to storage',
      timestamp: new Date().toISOString()
    });
  });
}

/**
 * Appends BMS telemetry event to persistent log file.
 * 
 * @param {string} logMessage - Log line to append
 * @param {Function} callback - Callback function (err, result)
 */
function appendBmsLog(logMessage, callback) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${logMessage}\n`;

  fs.appendFile(LOG_FILE, entry, 'utf-8', (err) => {
    if (err) {
      console.error('[Storage] Error appending log entry:', err.message);
      return callback(err, null);
    }
    return callback(null, {
      message: 'Audit log appended successfully',
      entry: entry.trim()
    });
  });
}

/**
 * Asynchronous Battery Health Diagnosis Service
 * Simulates diagnostic routine: sensor acquisition -> threshold check -> health scoring
 * 
 * @param {Function} onHealthEvaluated - Callback executed when diagnosis is complete
 */
function checkBatteryHealthWithCallback(onHealthEvaluated) {
  const logs = [];

  const logStep = (msg) => {
    console.log(msg);
    logs.push(msg);
  };

  logStep('Checking Battery...');

  setTimeout(() => {
    readBatteryDataAsync((err, data) => {
      if (err) {
        logStep('Failed to load battery data: ' + err.message);
        return onHealthEvaluated(err, { logs, health: 'Unknown' });
      }

      logStep('Battery Data Loaded...');
      logStep('Callback Executed');

      let healthStatus = 'Good';
      if (data.temperature > 50 || data.voltage < 42) {
        healthStatus = 'Critical Attention Needed';
      } else if (data.temperature > 40 || data.voltage < 45) {
        healthStatus = 'Fair / Warning';
      } else {
        healthStatus = data.batteryHealth || 'Good';
      }

      logStep(`Battery Health: ${healthStatus}`);

      onHealthEvaluated(null, {
        logs,
        batteryId: data.batteryId,
        health: healthStatus,
        voltage: data.voltage,
        temperature: data.temperature,
        chargePercentage: data.chargePercentage
      });
    });
  }, 300);
}

module.exports = {
  readBatteryDataSync,
  readBatteryDataAsync,
  writeBatteryData,
  appendBmsLog,
  checkBatteryHealthWithCallback,
  DATA_FILE,
  LOG_FILE
};
