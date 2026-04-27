const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay credentials not configured' });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const body = JSON.stringify({
    amount: 100000,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`
  });

  return new Promise((resolve) => {
    const request = https.request({
      hostname: 'api.razorpay.com',
      path: '/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          res.status(response.statusCode).json(parsed);
        } catch (e) {
          res.status(500).json({ error: 'Invalid response from Razorpay', raw: data });
        }
        resolve();
      });
    });

    request.on('error', (e) => {
      res.status(500).json({ error: e.message });
      resolve();
    });

    request.write(body);
    request.end();
  });
};
