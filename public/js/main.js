/**
 * Battery Management System (BMS) - Client Controller
 * Provides interactive features for:
 * 1. Live status refresh from /status API
 * 2. Diagnostics routine visual logger (/api/callback)
 * 3. File storage verification runner (/api/file-ops/test-all)
 * 4. Real-time parameters calculator (/api/calculate)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚡ BMS Client Controller Initialized');

  // 1. Live Telemetry Refresh via /status API
  const refreshBtn = document.getElementById('btn-refresh-status');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '🔄 Fetching...';
      try {
        const response = await fetch('/status');
        const data = await response.json();

        const valVoltage = document.getElementById('telemetry-voltage');
        const valCurrent = document.getElementById('telemetry-current');
        const valTemp = document.getElementById('telemetry-temp');
        const valSoc = document.getElementById('telemetry-soc');
        const valHealth = document.getElementById('telemetry-health');
        const valPower = document.getElementById('telemetry-power');
        const barFill = document.getElementById('battery-charge-fill');
        const lastUpdated = document.getElementById('telemetry-updated');

        if (valVoltage) valVoltage.textContent = Number(data.voltage).toFixed(2);
        if (valCurrent) valCurrent.textContent = Number(data.current).toFixed(2);
        if (valTemp) valTemp.textContent = Number(data.temperature).toFixed(1);
        if (valSoc) valSoc.textContent = data.chargePercentage;
        if (barFill) barFill.style.width = data.chargePercentage + '%';
        if (valHealth) valHealth.textContent = data.batteryHealth;
        if (valPower && data.calculatedPowerWatts) {
          valPower.textContent = Number(data.calculatedPowerWatts).toFixed(1);
        }
        if (lastUpdated && data.lastUpdated) {
          lastUpdated.textContent = new Date(data.lastUpdated).toLocaleTimeString();
        }

        showNotification('Telemetry refreshed successfully from /status API!', 'success');
      } catch (err) {
        console.error('Error refreshing telemetry:', err);
        showNotification('Failed to fetch /status: ' + err.message, 'error');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '🔄 Refresh Status';
      }
    });
  }

  // 2. Health Diagnostics Routine Runner
  const runCallbackBtn = document.getElementById('btn-run-callback');
  const callbackTerminal = document.getElementById('callback-terminal-body');

  if (runCallbackBtn && callbackTerminal) {
    runCallbackBtn.addEventListener('click', async () => {
      runCallbackBtn.disabled = true;
      runCallbackBtn.innerHTML = '⏳ Executing Diagnostics...';
      callbackTerminal.innerHTML = '<div class="terminal-line info">&gt; Initializing battery diagnostic routine...</div>';

      try {
        const res = await fetch('/api/callback');
        const data = await res.json();

        if (data.success && data.result) {
          callbackTerminal.innerHTML = '';
          const logs = data.result.logs || [
            'Checking Battery...',
            'Battery Data Loaded...',
            'Callback Executed',
            `Battery Health: ${data.result.health}`
          ];

          logs.forEach((logLine, index) => {
            setTimeout(() => {
              const lineElem = document.createElement('div');
              lineElem.className = 'terminal-line ' + (logLine.includes('Health') ? 'success' : 'info');
              lineElem.innerHTML = `&gt; ${logLine}`;
              callbackTerminal.appendChild(lineElem);
              callbackTerminal.scrollTop = callbackTerminal.scrollHeight;
            }, index * 250);
          });
        } else {
          callbackTerminal.innerHTML += `<div class="terminal-line warning">&gt; Diagnostics Error: ${data.error}</div>`;
        }
      } catch (e) {
        callbackTerminal.innerHTML += `<div class="terminal-line warning">&gt; Request failed: ${e.message}</div>`;
      } finally {
        setTimeout(() => {
          runCallbackBtn.disabled = false;
          runCallbackBtn.innerHTML = '▶️ Run Battery Diagnostics';
        }, 1200);
      }
    });
  }

  // 3. File System Storage Verification Runner
  const runFileOpsBtn = document.getElementById('btn-run-fileops');
  const fileOpsTerminal = document.getElementById('fileops-terminal-body');

  if (runFileOpsBtn && fileOpsTerminal) {
    runFileOpsBtn.addEventListener('click', async () => {
      runFileOpsBtn.disabled = true;
      runFileOpsBtn.innerHTML = '⏳ Verifying Storage...';
      fileOpsTerminal.innerHTML = '<div class="terminal-line info">&gt; Executing file storage verification...</div>';

      try {
        const res = await fetch('/api/file-ops/test-all');
        const result = await res.json();

        fileOpsTerminal.innerHTML = '';
        if (result.success && result.operations) {
          const ops = result.operations;

          const lines = [
            `[1] fs.readFileSync() : ${ops.readFileSync.message} (Voltage: ${ops.readFileSync.voltage}V)`,
            `[2] fs.readFile()     : ${ops.readFile.message} (Pack: ${ops.readFile.batteryId})`,
            `[3] fs.appendFile()   : ${ops.appendFile.message}`,
            `    -> Log entry: "${ops.appendFile.entry}"`,
            `[4] fs.writeFile()    : ${ops.writeFile.message}`,
            `✔ All 4 storage methods verified without errors.`
          ];

          lines.forEach((line, i) => {
            setTimeout(() => {
              const div = document.createElement('div');
              div.className = 'terminal-line ' + (line.startsWith('✔') ? 'success' : 'info');
              div.textContent = line;
              fileOpsTerminal.appendChild(div);
              fileOpsTerminal.scrollTop = fileOpsTerminal.scrollHeight;
            }, i * 200);
          });
        } else {
          fileOpsTerminal.innerHTML += `<div class="terminal-line warning">&gt; Verification failed: ${JSON.stringify(result)}</div>`;
        }
      } catch (err) {
        fileOpsTerminal.innerHTML += `<div class="terminal-line warning">&gt; Error invoking storage verification: ${err.message}</div>`;
      } finally {
        setTimeout(() => {
          runFileOpsBtn.disabled = false;
          runFileOpsBtn.innerHTML = '▶️ Test Storage Operations';
        }, 1500);
      }
    });
  }

  // 4. Interactive Parameters Calculator Form
  const calcForm = document.getElementById('form-bms-calculator');
  if (calcForm) {
    calcForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const voltage = parseFloat(document.getElementById('calc-voltage').value);
      const current = parseFloat(document.getElementById('calc-current').value);
      const capacity = parseFloat(document.getElementById('calc-capacity').value);
      const soc = parseFloat(document.getElementById('calc-soc').value);
      const pin = parseFloat(document.getElementById('calc-pin').value);

      try {
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voltage,
            current,
            capacity,
            chargePercentage: soc,
            inputPower: pin,
            outputPower: voltage * current
          })
        });

        const data = await response.json();
        if (data.success) {
          document.getElementById('res-calc-power').textContent = data.calculated.power;
          document.getElementById('res-calc-capacity').textContent = data.calculated.remainingCapacity;
          document.getElementById('res-calc-efficiency').textContent = data.calculated.efficiency;
          showNotification('Calculation updated successfully!', 'success');
        }
      } catch (err) {
        showNotification('Calculator error: ' + err.message, 'error');
      }
    });
  }
});

function showNotification(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '8px';
  toast.style.fontFamily = 'var(--font-main)';
  toast.style.fontSize = '0.9rem';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
  toast.style.transition = 'all 0.3s ease';

  if (type === 'success') {
    toast.style.background = '#064e3b';
    toast.style.color = '#00ff88';
    toast.style.border = '1px solid #10b981';
  } else {
    toast.style.background = '#7f1d1d';
    toast.style.color = '#fca5a5';
    toast.style.border = '1px solid #ef4444';
  }

  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
