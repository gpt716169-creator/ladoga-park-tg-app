const CREDENTIALS = {
  cottages: {
    propertyId: process.env.TL_PROPERTY_COTTAGES || '52159',
    clientId: process.env.TL_CLIENT_ID_COTTAGES || 'api_connection_9d1aa_ca2fef1de5',
    clientSecret: process.env.TL_CLIENT_SECRET_COTTAGES || 'CHXoevsKt6nKJqQZs2bJxL7zlFMUydrx'
  }
};

let tokenCache = { token: null, expiresAt: 0 };

async function getTLToken() {
  const creds = CREDENTIALS.cottages;
  const now = Date.now();

  if (tokenCache.token && tokenCache.expiresAt > now + 30000) {
    return tokenCache.token;
  }

  const res = await fetch('https://partner.tlintegration.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: creds.clientId,
      client_secret: creds.clientSecret
    })
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  }

  tokenCache.token = data.access_token;
  tokenCache.expiresAt = now + (data.expires_in * 1000);
  return data.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { month = '2026-08' } = req.query || {};

  try {
    const token = await getTLToken();

    // 1. Проверяем PMS API v2 бронирования Коттеджей
    const pmsRes = await fetch(`https://partner.tlintegration.com/api/pms/v2/properties/52159/reservations?status=Active`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const status = pmsRes.status;
    const text = await pmsRes.text();

    return res.status(200).json({
      property: 'cottages',
      propertyId: '52159',
      status,
      responseSample: text.substring(0, 1500)
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
