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

    const departuresByDay = {};
    for (let d = 1; d <= 31; d++) {
      const dStr = `${month}-${d < 10 ? '0' + d : d}`;
      departuresByDay[dStr] = 0;
    }

    const departuresList = [];

    const bRes = await fetch(`https://partner.tlintegration.com/api/read-reservation/v1/properties/52159/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const bData = await bRes.json();
    let summaries = Array.isArray(bData.bookingSummaries) ? bData.bookingSummaries : [];

    const recentSummaries = summaries.slice(-50);
    const batchSize = 10;

    for (let i = 0; i < recentSummaries.length; i += batchSize) {
      const batch = recentSummaries.slice(i, i + batchSize);
      const promises = batch.map(b => 
        fetch(`https://partner.tlintegration.com/api/read-reservation/v1/properties/52159/bookings/${b.number}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.ok ? r.json() : null).catch(() => null)
      );

      const results = await Promise.all(promises);
      for (const item of results) {
        const booking = item?.booking;
        if (!booking || booking.status === 'Cancelled') continue;

        for (const rs of (booking.roomStays || [])) {
          const dep = rs.stayDates?.departureDateTime || '';
          if (dep.startsWith(month)) {
            const dStr = dep.substring(0, 10);
            if (departuresByDay[dStr] !== undefined) {
              departuresByDay[dStr]++;
            }
            departuresList.push({
              bookingNumber: booking.number,
              guestName: `${booking.customer?.lastName || ''} ${booking.customer?.firstName || ''}`.trim() || 'Гость',
              roomType: rs.roomType?.name || 'Коттедж',
              arrivalDate: rs.stayDates?.arrivalDateTime?.substring(0, 10),
              departureDate: dStr
            });
          }
        }
      }
    }

    let totalDepartures = 0;
    Object.values(departuresByDay).forEach(v => totalDepartures += v);

    return res.status(200).json({
      property: 'cottages',
      propertyId: '52159',
      month,
      scannedSummariesCount: recentSummaries.length,
      totalDepartures,
      departuresByDay,
      departuresList
    });

  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
