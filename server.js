const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

app.post('/', async (req, res) => {
  const userAgent = req.get('X-QRZ-User-Agent') || 'QRZ-Proxy/1.0.0';
  console.log('Received request with headers:', {
    customUserAgent: req.get('X-QRZ-User-Agent'),
    browserUserAgent: req.get('User-Agent')
  });
  
  try {
    console.log('Forwarding to QRZ.com with User-Agent:', userAgent);
    const response = await fetch('https://logbook.qrz.com/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent,
      },
      body: new URLSearchParams(req.body).toString()
    });

    const text = await response.text();
    console.log('QRZ.com response:', text);
    res.send(text);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`QRZ Proxy server running on port ${port}`);
});