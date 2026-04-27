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

  const { qr_id } = req.body || {};
  if (!qr_id) {
    return res.status(400).json({ error: 'Missing qr_id' });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  return new Promise((resolve) => {
    const request = https.request({
      hostname: 'api.razorpay.com',
      path: `/v1/payments/qr_codes/${qr_id}/payments`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const payments = Array.isArray(parsed.items) ? parsed.items : [];
          const captured = payments.find(payment => payment.status === 'captured');
          res.status(200).json({
            paid: !!captured,
            payment: captured || null,
            count: payments.length
          });
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

    request.end();
  });
};
