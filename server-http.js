/**
 * Battery Management System (BMS) - Standalone HTTP Heartbeat Server
 * Built using Node.js native 'http' module.
 */

const http = require('http');

const PORT = process.env.HTTP_PORT || 3001;

// Create native HTTP server
const server = http.createServer((req, res) => {
  console.log(`[HTTP Heartbeat] Incoming request: ${req.method} ${req.url}`);

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BMS Standalone Heartbeat</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #060908;
          color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .card {
          background: #101a15;
          border: 1px solid #10b981;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          max-width: 600px;
          width: 100%;
        }
        .badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.15);
          color: #00ff88;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid #10b981;
        }
        h1 {
          font-size: 26px;
          margin-bottom: 15px;
          color: #ffffff;
        }
        p {
          color: #9ca3af;
          margin-bottom: 25px;
          font-size: 15px;
          line-height: 1.6;
        }
        .status-box {
          background: #030604;
          border-left: 4px solid #00ff88;
          padding: 15px;
          text-align: left;
          font-family: monospace;
          color: #00ff88;
          margin-bottom: 25px;
          border-radius: 4px;
        }
        .btn {
          display: inline-block;
          background: #10b981;
          color: #050505;
          text-decoration: none;
          font-weight: 700;
          padding: 10px 24px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .btn:hover {
          background: #00ff88;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">Standalone Heartbeat Service</div>
        <h1>Battery Management System Server Running</h1>
        <p>This lightweight health check is served directly by the native Node.js <code>http.createServer()</code> daemon.</p>
        <div class="status-box">
          &gt; Server Status: ONLINE<br>
          &gt; Protocol: HTTP/1.1<br>
          &gt; Port: ${PORT}<br>
          &gt; Timestamp: ${new Date().toISOString()}<br>
          &gt; Node Version: ${process.version}
        </div>
        <p>For the full BMS Telemetry Dashboard, access the main service on port 3000.</p>
      </div>
    </body>
    </html>
  `;

  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`⚡ Native HTTP Heartbeat Server is running!`);
  console.log(`⚡ Message: Battery Management System Server Running`);
  console.log(`⚡ URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});

module.exports = server;
