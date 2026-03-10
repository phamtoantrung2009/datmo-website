# Pii Ticket Issuer Automation

_Auto-issued for Datmo booking system — runs every 5 minutes_

---

## Overview

This script runs automatically every 5 minutes via cron job. Its job is to:
1. Check for bookings marked as "paid" (waiting to be issued)
2. Book tickets on Kalong portal
3. Update booking status to "issued"
4. Send ticket info to customer via Telegram

---

## Step 1: Check for Pending Bookings

```javascript
// Call this endpoint with Pii token
GET https://booking.datmo.io.vn/api/bookings/pending-issue
Headers: { "X-Pii-Token": "YOUR_PII_TOKEN" }
```

**Response example:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "DATMO-20260310-ABC1",
      "route": "ao-tien-co-to",
      "route_label": "Ao Tiên → Cô Tô",
      "travel_date": "2026-03-15",
      "departure_time": "07:30",
      "adults": 2,
      "children": 1,
      "passenger_name": "Nguyễn Văn A",
      "passenger_phone": "0912345678",
      "passenger_email": "email@example.com",
      "total_amount": 560000,
      "paid_at": "2026-03-10T10:30:00Z"
    }
  ]
}
```

**If no bookings:** Exit gracefully. Nothing to do.

**If bookings exist:** Process each one.

---

## Step 2: Login to Kalong (if needed)

The Kalong session may expire. Before booking, check if logged in.

### Login URL
https://datve.kalong.com.vn/dang-nhap

### Credentials (store in memory, do not share)
- Username: `dl.datmotravel`
- Password: `Datmo@2024`

### Login Steps
1. Navigate to https://datve.kalong.com.vn/dang-nhap
2. Type username into "Tài khoản" field
3. Type password into "Mật khẩu" field
4. Click "Đăng nhập" button
5. Wait for redirect to dashboard

### Verify Login
- Look for text "ĐẠI LÝ ĐẤT MỎ TRAVEL" in sidebar
- If redirected to login page → re-login

---

## Step 3: Book Ticket on Kalong

After login, follow these exact steps for each booking:

### Step 3a: Navigate to Booking Page
URL: https://datve.kalong.com.vn/bookings

### Step 3b: Select Route
Check the appropriate route checkbox:
- `AO TIÊN - CÔ TÔ` → for route `ao-tien-co-to`
- `CÔ TÔ - AO TIÊN` → for route `co-to-ao-tien`
- `MINH CHÂU - AO TIÊN` → for route `minh-chau-ao-tien`
- `AO TIÊN - MINH CHÂU` → for route `ao-tien-minh-chau`

### Step 3c: Select Date
- Click on the date picker
- Select the `travel_date` from the booking (format: DD/MM/YYYY)
- Example: If booking.travel_date = "2026-03-15", select March 15, 2026

### Step 3d: Search
- Click "Tìm kiếm" button
- Wait for results to load

### Step 3e: Select Trip
- Look for trip matching `departure_time`
- Click on the trip row to select it
- Note the vessel name (e.g., "QN-9565 - KA LONG 68")

### Step 3f: Enter Passenger Info
- Number of tickets = `adults` + `children`
- Passenger name = `passenger_name`
- Phone = `passenger_phone`
- Email = `passenger_email` (if provided)

### Step 3g: Confirm Booking
- Click confirm/đặt vé button
- Wait for booking to complete
- Capture the PNR/booking reference (shown after confirmation)

---

## Step 4: Get Ticket Reference

After booking:
1. Look for PNR code (format: S:YYMMDD.XX.XXXX)
2. This becomes `kalong_booking_ref`
3. Screenshot the confirmation if possible

---

## Step 5: Update Booking Status

Call the worker endpoint:

```javascript
POST https://booking.datmo.io.vn/api/booking/issued
Headers: { "X-Pii-Token": "YOUR_PII_TOKEN" }
Body: {
  "booking_id": "DATMO-20260310-ABC1",
  "kalong_booking_ref": "S:260315.25.ABCD",
  "ticket_url": null  // or URL if ticket can be downloaded
}
```

---

## Step 6: Notify Customer

Send Telegram message to passenger (if phone provided):

```javascript
// Use OpenClaw message tool
message(action="send", target="phone", message="...")
```

**Message template (Vietnamese):**
```
🎫 Xác nhận đặt vé thành công!

Mã đặt vé: {kalong_booking_ref}
Tuyến: {route_label}
Ngày: {travel_date} - {departure_time}
Hành khách: {passenger_name}
Số vé: {adults} người lớn + {children} trẻ em

Vé đã được xác nhận. Quý khách vui lòng đến cảng đúng giờ và mang theo CMND/CCCD.

Cảm ơn quý khách đã tin tưởng Đất Mỏ Travel!
```

---

## Error Handling

### If session expires mid-booking
- Re-login (Step 2)
- Re-attempt booking from Step 3a

### If no available seats
- Do NOT update booking to "issued"
- Update with error: status = "failed_no_seats"
- Notify Boss via Telegram

### If network error
- Retry up to 3 times with 5-second delay
- If still failing, log error and skip booking
- Alert Boss

---

## Environment Variables

Store these securely:
- `PII_TOKEN` - Token for Pii automation
- `ADMIN_TOKEN` - Token for Boss manual confirmations
- `KALONG_USERNAME` = "dl.datmotravel"
- `KALONG_PASSWORD` = "Datmo@2024"

---

## Cron Schedule

- **Job name:** datmo-ticket-issuer
- **Frequency:** Every 5 minutes
- **Endpoint:** GET /api/bookings/pending-issue
- **Action:** If results > 0, execute this full flow

---

## Success Metrics

Track in memory/console:
- Number of tickets issued today
- Number of failed bookings
- Any errors encountered
