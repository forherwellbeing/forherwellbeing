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

  const { name, phone, email, interest, booking_ref } = req.body || {};
  if (!name || !phone || !booking_ref) {
    return res.status(400).json({ error: 'Missing required booking details' });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const closeBy = Math.floor(Date.now() / 1000) + (30 * 60);
  const body = JSON.stringify({
    type: 'upi_qr',
    name: 'FHW Consultation',
    usage: 'single_use',
    fixed_amount: true,
    payment_amount: 100000,
    description: 'Consultation booking',
    close_by: closeBy,
    notes: {
      booking_ref,
      name,
      phone,
      email: email || '',
      interest: interest || ''
    }
  });

  return new Promise((resolve) => {
    const request = https.request({
      hostname: 'api.razorpay.com',
      path: '/v1/payments/qr_codes',
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
