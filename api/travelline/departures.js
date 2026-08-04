const CREDENTIALS = {
  cottages: {
    propertyId: process.env.TL_PROPERTY_COTTAGES || '52159',
    clientId: process.env.TL_CLIENT_ID_COTTAGES || 'api_connection_9d1aa_ca2fef1de5',
    clientSecret: process.env.TL_CLIENT_SECRET_COTTAGES || 'CHXoevsKt6nKJqQZs2bJxL7zlFMUydrx'
  },
  beach: {
    propertyId: process.env.TL_PROPERTY_BEACH || '54511',
    clientId: process.env.TL_CLIENT_ID_BEACH || 'api_connection_bca5a_50c3f923e5',
    clientSecret: process.env.TL_CLIENT_SECRET_BEACH || 'r1gtgA2UGey3D9swHDL01edbEPUEBZz3'
  }
};

const tokenCache = {
  cottages: { token: null, expiresAt: 0 },
  beach: { token: null, expiresAt: 0 }
};

async function getTLToken(propertyKey) {
  const creds = CREDENTIALS[propertyKey];
  const now = Date.now();

  if (tokenCache[propertyKey].token && tokenCache[propertyKey].expiresAt > now + 30000) {
    return tokenCache[propertyKey].token;
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
    throw new Error(`Auth failed for ${propertyKey}`);
  }

  tokenCache[propertyKey].token = data.access_token;
  tokenCache[propertyKey].expiresAt = now + (data.expires_in * 1000);
  return data.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const cToken = await getTLToken('cottages');
    const bToken = await getTLToken('beach');

    // 1. Получаем список последних бронирований Коттеджей (52159)
    const cRes = await fetch(`https://partner.tlintegration.com/api/read-reservation/v1/properties/52159/bookings`, {
      headers: { 'Authorization': `Bearer ${cToken}` }
    });
    const cData = await cRes.json();
    const cSummaries = cData.bookingSummaries || [];

    // 2. Получаем список последних бронирований Пляжа (54511)
    const bRes = await fetch(`https://partner.tlintegration.com/api/read-reservation/v1/properties/54511/bookings`, {
      headers: { 'Authorization': `Bearer ${bToken}` }
    });
    const bData = await bRes.json();
    const bSummaries = bData.bookingSummaries || [];

    // Проверяем детали по 15 случайным свежим броням Коттеджей
    const cSampleDetails = [];
    for (const b of cSummaries.slice(-15)) {
      const dRes = await fetch(`https://partner.tlintegration.com/api/read-reservation/v1/properties/52159/bookings/${b.number}`, {
        headers: { 'Authorization': `Bearer ${cToken}` }
      });
      if (dRes.ok) {
        const d = await dRes.json();
        if (d.booking) {
          const roomStays = d.booking.roomStays || [];
          cSampleDetails.push({
            number: b.number,
            status: d.booking.status,
            customer: `${d.booking.customer?.lastName || ''} ${d.booking.customer?.firstName || ''}`,
            stayDates: roomStays.map(r => r.stayDates)
          });
        }
      }
    }

    // Проверяем детали по 15 случайным свежим броням Пляжа
    const bSampleDetails = [];
    for (const b of bSummaries.slice(-15)) {
      const dRes = await fetch(`https://partner.tlintegration.com/api/read-reservation/v1/properties/54511/bookings/${b.number}`, {
        headers: { 'Authorization': `Bearer ${bToken}` }
      });
      if (dRes.ok) {
        const d = await dRes.json();
        if (d.booking) {
          const roomStays = d.booking.roomStays || [];
          bSampleDetails.push({
            number: b.number,
            status: d.booking.status,
            customer: `${d.booking.customer?.lastName || ''} ${d.booking.customer?.firstName || ''}`,
            stayDates: roomStays.map(r => r.stayDates)
          });
        }
      }
    }

    return res.status(200).json({
      cottagesCount: cSummaries.length,
      beachCount: bSummaries.length,
      cottagesSample: cSampleDetails,
      beachSample: bSampleDetails
    });

  } catch (err) {
    return res.status(200).json({ error: err.message, stack: err.stack });
  }
}
