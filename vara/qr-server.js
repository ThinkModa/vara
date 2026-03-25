const http = require('http');
const QRCode = require('qrcode');

const LOCAL_IP = '192.168.13.216';
const EXPO_PORT = 3000;
const QR_SERVER_PORT = 3003;
const expoUrl = `exp://${LOCAL_IP}:${EXPO_PORT}`;

const server = http.createServer(async (req, res) => {
  const qrDataUrl = await QRCode.toDataURL(expoUrl, {
    width: 300,
    margin: 2,
    color: { dark: '#1E293B', light: '#FFFFFF' },
  });

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Infertility Bestie — Expo Go</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
          background: linear-gradient(135deg, #FAFBFD 0%, #F5F3FF 50%, #FDE8EF 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card {
          background: white;
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          max-width: 420px;
        }
        .logo {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #667eea, #EC4899);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        h1 {
          font-size: 24px;
          font-weight: 800;
          color: #1E293B;
          margin-bottom: 4px;
        }
        .subtitle {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 32px;
        }
        .qr { border-radius: 16px; }
        .url-box {
          margin-top: 24px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 12px 16px;
          font-family: monospace;
          font-size: 14px;
          color: #6366F1;
          word-break: break-all;
        }
        .hint {
          margin-top: 16px;
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.5;
        }
        .status {
          display: inline-block;
          margin-top: 16px;
          padding: 6px 16px;
          background: #D1FAE5;
          color: #166534;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">❤️</div>
        <h1>Infertility Bestie</h1>
        <p class="subtitle">Scan with Expo Go to open on your device</p>
        <img class="qr" src="${qrDataUrl}" alt="QR Code" width="260" height="260" />
        <div class="url-box">${expoUrl}</div>
        <p class="hint">
          Open <strong>Expo Go</strong> on your phone → Scan QR Code<br/>
          Make sure your phone is on the same Wi-Fi network.
        </p>
        <span class="status">● Metro Bundler Running</span>
      </div>
    </body>
    </html>
  `);
});

server.listen(QR_SERVER_PORT, () => {
  console.log(`QR code page live at http://localhost:${QR_SERVER_PORT}`);
  console.log(`Expo URL: ${expoUrl}`);
});
