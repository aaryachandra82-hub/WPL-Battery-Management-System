/**
 * Custom Module: batteryCalculator.js
 * Experiment 5: Custom Module creation and export in Node.js
 * 
 * Provides mathematical and engineering calculations for a Battery Management System (BMS):
 * 1. Power (Watts / kW)
 * 2. Remaining Capacity (Ampere-hours / Ah)
 * 3. Power Conversion Efficiency (%)
 */

/**
 * Calculates instantaneous electrical power.
 * Formula: P = V * I (Watts)
 * 
 * @param {number} voltage - Voltage in Volts (V)
 * @param {number} current - Current in Amperes (A)
 * @returns {number} Power in Watts (W), rounded to 2 decimal places
 */
function calculatePower(voltage, current) {
  const v = parseFloat(voltage) || 0;
  const i = parseFloat(current) || 0;
  const power = v * i;
  return parseFloat(power.toFixed(2));
}

/**
 * Calculates remaining usable capacity based on nominal capacity and State of Charge (SoC).
 * Formula: Remaining Capacity = Capacity * (Charge Percentage / 100)
 * 
 * @param {number} capacity - Total nominal battery capacity in Ampere-hours (Ah)
 * @param {number} chargePercentage - State of Charge percentage (0 - 100%)
 * @returns {number} Remaining capacity in Ampere-hours (Ah), rounded to 2 decimal places
 */
function calculateRemainingCapacity(capacity, chargePercentage) {
  const cap = parseFloat(capacity) || 0;
  const soc = parseFloat(chargePercentage) || 0;
  // Constrain SoC between 0 and 100
  const clampedSoc = Math.min(Math.max(soc, 0), 100);
  const remaining = cap * (clampedSoc / 100);
  return parseFloat(remaining.toFixed(2));
}

/**
 * Calculates power conversion / charging efficiency.
 * Formula: Efficiency (%) = (Output Power / Input Power) * 100
 * 
 * @param {number} inputPower - Power supplied into the battery or charger (Watts)
 * @param {number} outputPower - Usable power delivered by the battery or charger (Watts)
 * @returns {number} Efficiency percentage (%), rounded to 2 decimal places
 */
function calculateEfficiency(inputPower, outputPower) {
  const pIn = parseFloat(inputPower) || 0;
  const pOut = parseFloat(outputPower) || 0;

  if (pIn <= 0) {
    return 0; // Prevent division by zero or invalid negative input power
  }

  const efficiency = (pOut / pIn) * 100;
  return parseFloat(Math.min(efficiency, 100).toFixed(2));
}

// Export functions as a CommonJS module
module.exports = {
  calculatePower,
  calculateRemainingCapacity,
  calculateEfficiency
};
