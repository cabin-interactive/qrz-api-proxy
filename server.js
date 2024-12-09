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

app.post('/api', async (req, res) => {
  try {
    const response = await fetch('https://logbook.qrz.com/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': req.get('User-Agent') || 'QRZ-CORS-Proxy/1.0.0',
      },
      body: new URLSearchParams(req.body).toString()
    });

    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`QRZ Proxy server running on port ${port}`);
});
