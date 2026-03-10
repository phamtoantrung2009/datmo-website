/**
 * Datmo Booking Worker
 * Handles booking creation, payment confirmation, and ticket issuance
 */

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://datmo.io.vn',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token, X-Pii-Token',
};

function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function jsonResponse(data, status = 200) {
  return corsResponse(JSON.stringify(data), status);
}

function errorResponse(message, status = 400) {
  return jsonResponse({ success: false, error: message }, status);
}

// Generate booking ID
function generateBookingId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DATMO-${dateStr}-${random}`;
}

// Get current timestamp in ISO format
function nowISO() {
  return new Date().toISOString();
}

// Add minutes to current time
function addMinutes(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

// Validate required fields
function validateBookingInput(body) {
  const required = ['route', 'travel_date', 'passenger_name', 'passenger_phone', 'adults'];
  const missing = required.filter(field => !body[field]);
  
  if (missing.length > 0) {
    return { valid: false, error: `Missing required fields: ${missing.join(', ')}` };
  }
  
  if (body.adults < 1) {
    return { valid: false, error: 'At least 1 adult is required' };
  }
  
  if (body.children && body.children < 0) {
    return { valid: false, error: 'Children count cannot be negative' };
  }
  
  // Validate travel date is not in the past
  const travelDate = new Date(body.travel_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (travelDate < today) {
    return { valid: false, error: 'Travel date cannot be in the past' };
  }
  
  return { valid: true };
}

// Generate booking ID - moved inside fetch

export default {
  async fetch(request, env) {
    // Get environment variables
    const ADMIN_TOKEN = env.ADMIN_TOKEN || '';
    const PII_TOKEN = env.PII_TOKEN || '';
    const ACCOUNT_NO = env.ACCOUNT_NO || 'FILL_IN_BOSS';
    const BANK_NAME = env.BANK_ID || 'Vietcombank';
    const ACCOUNT_NAME = env.ACCOUNT_NAME || 'DAT MO TRAVEL';

    // Helper functions that need env variables
    function buildVietQR(amount, addInfo) {
      const encodedNote = encodeURIComponent(addInfo);
      return `https://img.vietqr.io/image/${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodedNote}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
    }

    function verifyAdminToken(token) {
      return token === ADMIN_TOKEN && ADMIN_TOKEN !== '';
    }

    function verifyPiiToken(token) {
      return token === PII_TOKEN && PII_TOKEN !== '';
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route: GET /api/schedules
      if (path === '/api/schedules' && request.method === 'GET') {
        const route = url.searchParams.get('route');
        
        let query = 'SELECT route, departure_time, vessel, days_of_week FROM schedules';
        let params = [];
        
        if (route) {
          query += ' WHERE route = ?';
          params = [route];
        }
        
        query += ' ORDER BY departure_time';
        
        const { results } = await env.DB.prepare(query).bind(...params).all();
        
        return jsonResponse({ success: true, schedules: results });
      }

      // Route: POST /api/booking/create
      if (path === '/api/booking/create' && request.method === 'POST') {
        try {
          const body = await request.json();
          
          // Validate input
          const validation = validateBookingInput(body);
          if (!validation.valid) {
            return errorResponse(validation.error, 400);
          }
          
          // Fetch pricing
          const pricingStmt = await env.DB.prepare(
            'SELECT route_label, adult_price, child_price FROM pricing WHERE route = ?'
          ).bind(body.route);
          
          const pricing = await pricingStmt.first();
          
          console.log('Pricing:', JSON.stringify(pricing));
          
          if (!pricing) {
            return errorResponse('Invalid route: ' + body.route, 400);
          }
          
          // Calculate total
          const adults = parseInt(body.adults) || 1;
          const children = parseInt(body.children) || 0;
          const total = (adults * pricing.adult_price) + (children * pricing.child_price);
          
          // Generate booking ID
          const bookingId = generateBookingId();
          const now = nowISO();
          const expiresAt = addMinutes(15);
          
          // Build VietQR
          const qrUrl = buildVietQR(total, bookingId);
          
          // Insert booking
          await env.DB.prepare(`
            INSERT INTO bookings (
              id, route, route_label, travel_date, departure_time,
              adults, children, passenger_name, passenger_phone, passenger_email,
              total_amount, status, created_at, expires_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment', ?, ?)
          `).bind(
            bookingId, body.route, pricing.route_label, body.travel_date,
            body.departure_time || null, adults, children,
            body.passenger_name, body.passenger_phone, body.passenger_email || null,
            total, now, expiresAt
          ).run();
          
          return jsonResponse({
            success: true,
            booking_id: bookingId,
            total_amount: total,
            qr_url: qrUrl,
            expires_at: expiresAt,
            bank: {
              bank_name: BANK_NAME,
              account_no: ACCOUNT_NO,
              account_name: ACCOUNT_NAME,
              transfer_note: bookingId
            }
          });
        } catch (e) {
          console.error('Create booking error:', e);
          return errorResponse('Error: ' + e.message, 500);
        }
      }

      // Route: GET /api/booking/status
      if (path === '/api/booking/status' && request.method === 'GET') {
        const bookingId = url.searchParams.get('id');
        
        if (!bookingId) {
          return errorResponse('Missing booking id', 400);
        }
        
        const booking = await env.DB.prepare(
          'SELECT * FROM bookings WHERE id = ?'
        ).bind(bookingId).first();
        
        if (!booking) {
          return errorResponse('Booking not found', 404);
        }
        
        // Check if expired
        if (booking.status === 'pending_payment') {
          const expiresAt = new Date(booking.expires_at);
          const now = new Date();
          
          if (now > expiresAt) {
            await env.DB.prepare(
              "UPDATE bookings SET status = 'expired' WHERE id = ?"
            ).bind(bookingId).run();
            
            return jsonResponse({
              success: true,
              booking: {
                ...booking,
                status: 'expired'
              }
            });
          }
        }
        
        return jsonResponse({
          success: true,
          booking: {
            id: booking.id,
            route: booking.route,
            route_label: booking.route_label,
            travel_date: booking.travel_date,
            departure_time: booking.departure_time,
            adults: booking.adults,
            children: booking.children,
            passenger_name: booking.passenger_name,
            passenger_phone: booking.passenger_phone,
            total_amount: booking.total_amount,
            status: booking.status,
            kalong_booking_ref: booking.kalong_booking_ref,
            ticket_url: booking.ticket_url,
            created_at: booking.created_at,
            expires_at: booking.expires_at,
            paid_at: booking.paid_at,
            issued_at: booking.issued_at
          }
        });
      }

      // Route: POST /api/booking/confirm
      if (path === '/api/booking/confirm' && request.method === 'POST') {
        const token = request.headers.get('X-Admin-Token');
        
        if (!verifyAdminToken(token)) {
          return errorResponse('Unauthorized', 401);
        }
        
        const body = await request.json();
        const { booking_id } = body;
        
        if (!booking_id) {
          return errorResponse('Missing booking_id', 400);
        }
        
        // Check booking exists and status
        const booking = await env.DB.prepare(
          "SELECT * FROM bookings WHERE id = ? AND status = 'pending_payment'"
        ).bind(booking_id).first();
        
        if (!booking) {
          return errorResponse('Booking not found or already processed', 404);
        }
        
        // Update to paid
        const now = nowISO();
        await env.DB.prepare(
          "UPDATE bookings SET status = 'paid', paid_at = ? WHERE id = ?"
        ).bind(now, booking_id).run();
        
        return jsonResponse({
          success: true,
          booking_id: booking_id,
          passenger_name: booking.passenger_name,
          route: booking.route_label,
          travel_date: booking.travel_date,
          total_amount: booking.total_amount
        });
      }

      // Route: POST /api/booking/issued
      if (path === '/api/booking/issued' && request.method === 'POST') {
        const token = request.headers.get('X-Pii-Token');
        
        if (!verifyPiiToken(token)) {
          return errorResponse('Unauthorized', 401);
        }
        
        const body = await request.json();
        const { booking_id, kalong_booking_ref, ticket_url } = body;
        
        if (!booking_id) {
          return errorResponse('Missing booking_id', 400);
        }
        
        // Update booking
        const now = nowISO();
        await env.DB.prepare(
          "UPDATE bookings SET status = 'issued', kalong_booking_ref = ?, ticket_url = ?, issued_at = ? WHERE id = ?"
        ).bind(kalong_booking_ref || null, ticket_url || null, now, booking_id).run();
        
        return jsonResponse({ success: true });
      }

      // Route: GET /api/bookings/pending-issue
      if (path === '/api/bookings/pending-issue' && request.method === 'GET') {
        const token = request.headers.get('X-Pii-Token');
        
        if (!verifyPiiToken(token)) {
          return errorResponse('Unauthorized', 401);
        }
        
        const { results } = await env.DB.prepare(
          "SELECT * FROM bookings WHERE status = 'paid' ORDER BY paid_at ASC"
        ).all();
        
        return jsonResponse({
          success: true,
          bookings: results.map(b => ({
            id: b.id,
            route: b.route,
            route_label: b.route_label,
            travel_date: b.travel_date,
            departure_time: b.departure_time,
            adults: b.adults,
            children: b.children,
            passenger_name: b.passenger_name,
            passenger_phone: b.passenger_phone,
            passenger_email: b.passenger_email,
            total_amount: b.total_amount,
            paid_at: b.paid_at,
            created_at: b.created_at
          }))
        });
      }

      // Route: GET /api/bookings/pending-payment
      if (path === '/api/bookings/pending-payment' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          "SELECT id, route_label, travel_date, departure_time, passenger_name, total_amount, expires_at FROM bookings WHERE status = 'pending_payment' ORDER BY created_at DESC"
        ).all();
        
        return jsonResponse({
          success: true,
          bookings: results
        });
      }

      // 404 for unmatched routes
      return errorResponse('Not found', 404);

    } catch (error) {
      console.error('Worker error:', error);
      return errorResponse('Internal server error', 500);
    }
  }
};
