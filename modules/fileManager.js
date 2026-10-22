/**
 * Module: fileManager.js
 * Experiments 3 & 4: Node.js Callback Pattern & File System (fs) Operations
 * 
 * Demonstrates:
 * 1. fs.readFileSync() - Synchronous file read
 * 2. fs.readFile() - Asynchronous file read with error-first callback
 * 3. fs.writeFile() - Asynchronous file write
 * 4. fs.appendFile() - Asynchronous file append for telemetry logging
 * 5. checkBatteryHealthCallback() - Callback demonstration flow
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'batteryData.json');
const LOG_FILE = path.join(__dirname, '..', 'data', 'logs.txt');

/**
 * 1. SYNCHRONOUS READ: fs.readFileSync()
 * Reads battery data synchronously (blocking I/O).
 * 
 * @returns {Object} Parsed JSON battery data
 */
function readBatteryDataSync() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(rawData);
    console.log('[fs.readFileSync] Successfully read batteryData.json synchronously.');
    return { success: true, data: parsedData, method: 'readFileSync' };
  } catch (error) {
    console.error('[fs.readFileSync] Error reading file:', error.message);
    return { success: false, error: error.message, method: 'readFileSync' };
  }
}

/**
 * 2. ASYNCHRONOUS READ: fs.readFile()
 * Reads battery data asynchronously using error-first callback pattern (non-blocking I/O).
 * 
 * @param {Function} callback - Callback function (err, data)
 */
function readBatteryDataAsync(callback) {
  fs.readFile(DATA_FILE, 'utf-8', (err, rawData) => {
    if (err) {
      console.error('[fs.readFile] Error reading file asynchronously:', err.message);
      return callback(err, null);
    }
    try {
      const parsedData = JSON.parse(rawData);
      console.log('[fs.readFile] Successfully read batteryData.json asynchronously.');
      return callback(null, parsedData);
    } catch (parseErr) {
      console.error('[fs.readFile] JSON parse error:', parseErr.message);
      return callback(parseErr, null);
    }
  });
}

/**
 * 3. ASYNCHRONOUS WRITE: fs.writeFile()
 * Overwrites or creates batteryData.json with updated battery information.
 * 
 * @param {Object} updatedData - Object containing updated battery metrics
 * @param {Function} callback - Callback function (err, result)
 */
function writeBatteryData(updatedData, callback) {
  const jsonString = JSON.stringify(updatedData, null, 2);
  fs.writeFile(DATA_FILE, jsonString, 'utf-8', (err) => {
    if (err) {
      console.error('[fs.writeFile] Error writing to batteryData.json:', err.message);
      return callback(err, null);
    }
    console.log('[fs.writeFile] Successfully saved data to batteryData.json.');
    return callback(null, {
      message: 'Battery data written successfully via fs.writeFile()',
      timestamp: new Date().toISOString()
    });
  });
}

/**
 * 4. ASYNCHRONOUS APPEND: fs.appendFile()
 * Appends BMS log entry / telemetry event to data/logs.txt without overwriting.
 * 
 * @param {string} logMessage - Log line to append
 * @param {Function} callback - Callback function (err, result)
 */
function appendBmsLog(logMessage, callback) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${logMessage}\n`;

  fs.appendFile(LOG_FILE, entry, 'utf-8', (err) => {
    if (err) {
      console.error('[fs.appendFile] Error appending to logs.txt:', err.message);
      return callback(err, null);
    }
    console.log(`[fs.appendFile] Log entry recorded: ${logMessage}`);
    return callback(null, {
      message: 'Log appended successfully via fs.appendFile()',
      entry: entry.trim()
    });
  });
}

/**
 * EXPERIMENT 3: Callback Demonstration Function
 * Simulates battery health diagnosis after reading data.
 * 
 * Step-by-step console flow:
 * 1. Checking Battery...
 * 2. Battery Data Loaded...
 * 3. Callback Executed
 * 4. Battery Health: Good (or evaluated status)
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

  // Asynchronously read data simulating BMS sensor acquisition delay
  setTimeout(() => {
    readBatteryDataAsync((err, data) => {
      if (err) {
        logStep('Failed to load battery data: ' + err.message);
        return onHealthEvaluated(err, { logs, health: 'Unknown' });
      }

      logStep('Battery Data Loaded...');

      // Execute callback with diagnosis logic
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

      // Invoke callback
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
