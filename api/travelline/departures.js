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

    // Запрос PMS Analytics по дням для июля и августа
    const julyRes = await fetch(`https://partner.tlintegration.com/api/pms-analytics/v1/properties/52159/daily-occupancy?startStayDate=2026-07-01&endStayDate=2026-07-31`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const julyData = await julyRes.json();

    const augRes = await fetch(`https://partner.tlintegration.com/api/pms-analytics/v1/properties/52159/daily-occupancy?startStayDate=2026-08-01&endStayDate=2026-08-31`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const augData = await augRes.json();

    return res.status(200).json({
      property: 'cottages',
      propertyId: '52159',
      julySample: julyData.dailyOccupancies?.slice(0, 5),
      julyTotalDays: julyData.dailyOccupancies?.length,
      augustSample: augData.dailyOccupancies?.slice(0, 5),
      augustTotalDays: augData.dailyOccupancies?.length
    });

  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
