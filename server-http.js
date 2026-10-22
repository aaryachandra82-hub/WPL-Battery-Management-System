/**
 * Experiment 1: Basic Node.js HTTP Server
 * Uses the built-in 'http' module to handle requests and responses.
 * 
 * Requirement:
 * - Create a basic server using the built-in http module.
 * - Display "Battery Management System Server Running".
 */

const http = require('http');

const PORT = process.env.HTTP_PORT || 3001;

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`[HTTP Server] Incoming request: ${req.method} ${req.url}`);

  // Set HTTP Response Headers
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  // Response content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BMS Native HTTP Server</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #0a0f0d;
          color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .card {
          background: #111827;
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
          color: #10b981;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid #10b981;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 15px;
          color: #ffffff;
        }
        p {
          color: #9ca3af;
          margin-bottom: 25px;
          font-size: 16px;
          line-height: 1.6;
        }
        .status-box {
          background: #050505;
          border-left: 4px solid #10b981;
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
        <div class="badge">Experiment 1: Built-in HTTP Module</div>
        <h1>Battery Management System Server Running</h1>
        <p>This web page is served directly by the native Node.js <code>http.createServer()</code> without any external frameworks.</p>
        <div class="status-box">
          &gt; Server Status: ONLINE<br>
          &gt; Protocol: HTTP/1.1<br>
          &gt; Port: ${PORT}<br>
          &gt; Timestamp: ${new Date().toISOString()}<br>
          &gt; Node Version: ${process.version}
        </div>
        <p>For the complete Express.js BMS Dashboard with EJS templates, run <code>npm start</code> to access port 3000.</p>
      </div>
    </body>
    </html>
  `;

  // Write and end response
  res.end(htmlContent);
});

// Start listening
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`⚡ [Experiment 1] Native HTTP Server is running!`);
  console.log(`⚡ Message: Battery Management System Server Running`);
  console.log(`⚡ URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});

module.exports = server;
