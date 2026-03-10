/**
 * Datmo Booking Worker
 * Handles booking creation, payment confirmation, and ticket issuance
 * Supports both one-way and round-trip bookings
 */

// CORS headers — allow both main site and booking subdomain
const ALLOWED_ORIGINS = [
  'https://datmo.io.vn',
  'https://booking.datmo.io.vn',
];

function getCorsHeaders(request) {
  const origin = request?.headers?.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token, X-Pii-Token',
  };
}

// Store request reference for CORS header generation
let _currentRequest = null;

function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...getCorsHeaders(_currentRequest),
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

// Get reverse route mapping
function getReverseRoute(route) {
  const routeMap = {
    'ao-tien-co-to': 'co-to-ao-tien',
    'co-to-ao-tien': 'ao-tien-co-to',
    'ao-tien-quan-lan': 'quan-lan-ao-tien',
    'quan-lan-ao-tien': 'ao-tien-quan-lan',
    'ao-tien-minh-chau': 'minh-chau-ao-tien',
    'minh-chau-ao-tien': 'ao-tien-minh-chau',
  };
  return routeMap[route] || route;
}

// Validate required fields for one-way booking
function validateOneWayInput(body) {
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

// Validate round-trip booking
function validateRoundTripInput(body) {
  const validation = validateOneWayInput(body);
  if (!validation.valid) return validation;
  
  if (!body.return_date) {
    return { valid: false, error: 'Return date is required for round-trip booking' };
  }
  
  const returnDate = new Date(body.return_date);
  const travelDate = new Date(body.travel_date);
  
  if (returnDate < travelDate) {
    return { valid: false, error: 'Return date must be after or on outbound date' };
  }
  
  return { valid: true };
}

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

    // Store request for CORS headers
    _currentRequest = request;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: getCorsHeaders(request) });
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
          
          const isRoundTrip = body.trip_type === 'round-trip';
          
          // Validate based on trip type
          const validation = isRoundTrip 
            ? validateRoundTripInput(body)
            : validateOneWayInput(body);
            
          if (!validation.valid) {
            return errorResponse(validation.error, 400);
          }
          
          // Fetch outbound pricing
          const outboundPricing = await env.DB.prepare(
            'SELECT route, route_label, adult_price, child_price FROM pricing WHERE route = ?'
          ).bind(body.route).first();
          
          if (!outboundPricing) {
            return errorResponse('Invalid outbound route: ' + body.route, 400);
          }
          
          // Calculate outbound total
          const adults = parseInt(body.adults) || 1;
          const children = parseInt(body.children) || 0;
          const outboundTotal = (adults * outboundPricing.adult_price) + (children * outboundPricing.child_price);
          
          const now = nowISO();
          const expiresAt = addMinutes(15);
          
          // Generate booking IDs
          const outboundId = generateBookingId();
          let returnId = null;
          let returnTotal = 0;
          let returnPricing = null;
          
          // If round-trip, create return booking
          if (isRoundTrip) {
            const returnRoute = getReverseRoute(body.route);
            
            returnPricing = await env.DB.prepare(
              'SELECT route, route_label, adult_price, child_price FROM pricing WHERE route = ?'
            ).bind(returnRoute).first();
            
            if (!returnPricing) {
              return errorResponse('Invalid return route: ' + returnRoute, 400);
            }
            
            returnTotal = (adults * returnPricing.adult_price) + (children * returnPricing.child_price);
            returnId = generateBookingId();
          }
          
          const totalAmount = outboundTotal + returnTotal;
          
          // Build VietQR using outbound ID as transfer reference
          const qrUrl = buildVietQR(totalAmount, outboundId);
          
          // Insert outbound booking
          await env.DB.prepare(`
            INSERT INTO bookings (
              id, route, route_label, travel_date, departure_time,
              adults, children, passenger_name, passenger_phone, passenger_email,
              total_amount, status, created_at, expires_at, linked_booking_id, trip_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment', ?, ?, ?, ?)
          `).bind(
            outboundId, body.route, outboundPricing.route_label, body.travel_date,
            body.departure_time || null, adults, children,
            body.passenger_name, body.passenger_phone, body.passenger_email || null,
            outboundTotal, now, expiresAt, returnId, 'one-way'
          ).run();
          
          // Insert return booking if round-trip
          if (isRoundTrip && returnId) {
            await env.DB.prepare(`
              INSERT INTO bookings (
                id, route, route_label, travel_date, departure_time,
                adults, children, passenger_name, passenger_phone, passenger_email,
                total_amount, status, created_at, expires_at, linked_booking_id, trip_type
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment', ?, ?, ?, 'round-trip')
            `).bind(
              returnId, returnPricing.route, returnPricing.route_label, body.return_date,
              body.return_departure_time || null, adults, children,
              body.passenger_name, body.passenger_phone, body.passenger_email || null,
              returnTotal, now, expiresAt, outboundId, 'round-trip'
            ).run();
          }
          
          // Build response
          const response = {
            success: true,
            booking_id: outboundId,
            trip_type: isRoundTrip ? 'round-trip' : 'one-way',
            total_amount: totalAmount,
            qr_url: qrUrl,
            expires_at: expiresAt,
            bank: {
              bank_name: BANK_NAME,
              account_no: ACCOUNT_NO,
              account_name: ACCOUNT_NAME,
              transfer_note: outboundId
            }
          };
          
          if (isRoundTrip) {
            response.booking_ids = [outboundId, returnId];
            response.outbound = {
              id: outboundId,
              route: body.route,
              route_label: outboundPricing.route_label,
              travel_date: body.travel_date,
              departure_time: body.departure_time,
              amount: outboundTotal
            };
            response.return = {
              id: returnId,
              route: returnPricing.route,
              route_label: returnPricing.route_label,
              travel_date: body.return_date,
              departure_time: body.return_departure_time,
              amount: returnTotal
            };
          }
          
          return jsonResponse(response);
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
        
        // Check if linked booking exists (for round-trip)
        let linkedBooking = null;
        if (booking.linked_booking_id) {
          linkedBooking = await env.DB.prepare(
            'SELECT * FROM bookings WHERE id = ?'
          ).bind(booking.linked_booking_id).first();
        }
        
        // Calculate total for round-trip
        let totalAmount = booking.total_amount;
        if (linkedBooking) {
          totalAmount = booking.total_amount + linkedBooking.total_amount;
        }
        
        return jsonResponse({
          success: true,
          booking: {
            id: booking.id,
            trip_type: booking.trip_type || 'one-way',
            route: booking.route,
            route_label: booking.route_label,
            travel_date: booking.travel_date,
            departure_time: booking.departure_time,
            adults: booking.adults,
            children: booking.children,
            passenger_name: booking.passenger_name,
            passenger_phone: booking.passenger_phone,
            total_amount: totalAmount,
            status: booking.status,
            kalong_booking_ref: booking.kalong_booking_ref,
            ticket_url: booking.ticket_url,
            created_at: booking.created_at,
            expires_at: booking.expires_at,
            paid_at: booking.paid_at,
            issued_at: booking.issued_at,
            linked_booking: linkedBooking ? {
              id: linkedBooking.id,
              route: linkedBooking.route,
              route_label: linkedBooking.route_label,
              travel_date: linkedBooking.travel_date,
              departure_time: linkedBooking.departure_time,
              status: linkedBooking.status,
              kalong_booking_ref: linkedBooking.kalong_booking_ref
            } : null
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
        
        // Update to paid (both outbound and return if linked)
        const now = nowISO();
        await env.DB.prepare(
          "UPDATE bookings SET status = 'paid', paid_at = ? WHERE id = ?"
        ).bind(now, booking_id).run();
        
        // If linked booking exists, mark it as paid too
        if (booking.linked_booking_id) {
          await env.DB.prepare(
            "UPDATE bookings SET status = 'paid', paid_at = ? WHERE id = ?"
          ).bind(now, booking.linked_booking_id).run();
        }
        
        // Get linked booking for total
        let totalAmount = booking.total_amount;
        if (booking.linked_booking_id) {
          const linked = await env.DB.prepare('SELECT total_amount FROM bookings WHERE id = ?')
            .bind(booking.linked_booking_id).first();
          if (linked) {
            totalAmount = booking.total_amount + linked.total_amount;
          }
        }
        
        return jsonResponse({
          success: true,
          booking_id: booking_id,
          trip_type: booking.trip_type || 'one-way',
          passenger_name: booking.passenger_name,
          route: booking.route_label,
          travel_date: booking.travel_date,
          total_amount: totalAmount
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
        
        // If linked booking exists, mark it as issued too
        const booking = await env.DB.prepare('SELECT linked_booking_id FROM bookings WHERE id = ?')
          .bind(booking_id).first();
        
        if (booking?.linked_booking_id) {
          await env.DB.prepare(
            "UPDATE bookings SET status = 'issued', kalong_booking_ref = ?, ticket_url = ?, issued_at = ? WHERE id = ?"
          ).bind(kalong_booking_ref || null, ticket_url || null, now, booking.linked_booking_id).run();
        }
        
        return jsonResponse({ success: true });
      }

      // Route: GET /api/bookings/pending-issue
      if (path === '/api/bookings/pending-issue' && request.method === 'GET') {
        const token = request.headers.get('X-Pii-Token');
        
        if (!verifyPiiToken(token)) {
          return errorResponse('Unauthorized', 401);
        }
        
        // Get only outbound bookings (trip_type = 'one-way') to avoid duplicates
        const { results } = await env.DB.prepare(
          "SELECT * FROM bookings WHERE status = 'paid' AND (trip_type = 'one-way' OR trip_type IS NULL) ORDER BY paid_at ASC"
        ).all();
        
        return jsonResponse({
          success: true,
          bookings: results.map(b => ({
            id: b.id,
            trip_type: b.trip_type || 'one-way',
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
            linked_booking_id: b.linked_booking_id,
            paid_at: b.paid_at,
            created_at: b.created_at
          }))
        });
      }

      // Route: GET /api/bookings/pending-payment
      if (path === '/api/bookings/pending-payment' && request.method === 'GET') {
        // Get only outbound bookings for pending payment list
        const { results } = await env.DB.prepare(
          "SELECT id, route_label, travel_date, departure_time, passenger_name, total_amount, expires_at, linked_booking_id FROM bookings WHERE status = 'pending_payment' AND (trip_type = 'one-way' OR trip_type IS NULL) ORDER BY created_at DESC"
        ).all();
        
        return jsonResponse({
          success: true,
          bookings: results
        });
      }

      // Serve static assets for non-API routes (booking frontend)
      return env.ASSETS.fetch(request);

    } catch (error) {
      console.error('Worker error:', error);
      return errorResponse('Internal server error', 500);
    }
  }
};
