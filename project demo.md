# ADAL – Next.js + Supabase Full Stack Specification
Project: Bangalore Office Ride Sharing
Database: Supabase PostgreSQL
Backend: Next.js API Routes
ORM: Prisma (Recommended)
Authentication: Phone OTP (Custom)
Deployment Target: Vercel
Environment Variables Required: YES (.env mandatory)

------------------------------------------------------------
1. SYSTEM OVERVIEW
------------------------------------------------------------

ADAL is a Bangalore office ride-sharing platform.

Core Business Rules:

1. Only vehicle owners can create bookings.
2. Users cannot join their own booking qas ridesharing
3. Only bookings with status = OPEN should appear in Available Bookings screen.
4. Once first passenger joins:
   - Insert record into shared_rides
   - Update booking.status = SHARED
   - Decrease available_seats by 1
   - Remove from Available Bookings screen
5. Price = distance_km × 2 INR
6. Distance calculated via Google Maps API.

------------------------------------------------------------
2. SUPABASE REQUIREMENTS
------------------------------------------------------------

Supabase is used ONLY as PostgreSQL provider.
We are NOT using Supabase Auth.

We require:

1. Project URL
2. Anon Public Key
3. Service Role Key (Backend only)
4. PostgreSQL Connection String (DATABASE_URL)

Password must NOT be committed to Git.
If password was shared publicly, it must be rotated immediately.

------------------------------------------------------------
3. ENVIRONMENT VARIABLES (.env.local REQUIRED)
------------------------------------------------------------

Create a file:

.env.local

Required Variables:

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Prisma)
DATABASE_URL=

# Authentication
JWT_SECRET=

# OTP Provider
OTP_PROVIDER_API_KEY=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_API_KEY=

# App
APP_BASE_URL=

Do not push .env to version control.

------------------------------------------------------------
4. DATABASE DESIGN (SUPABASE POSTGRESQL)
------------------------------------------------------------

4.1 USERS TABLE

Purpose:
Stores registered users.

Fields:

- id (UUID, Primary Key)
- full_name (string, required)
- email (unique, required)
- phone_number (unique, required)
- date_of_birth (date, required)
- is_vehicle_owner (boolean, default false)
- account_status (enum: ACTIVE, BLOCKED)
- vehicle_type (string)
- vehicle_model (string)
- vehicle_color (string)
- vehicle_number (unique)
- seating_capacity (integer >=1)
- created_at (timestamp)
- updated_at (timestamp)

Rules:
- OTP login uses phone_number.
- Email and phone must be unique.
- If is_vehicle_owner = true, vehicle must exist.

------------------------------------------------------------

4.3 BOOKINGS TABLE

Purpose:
Stores rides created by vehicle owners.

Fields:

- id (UUID)
- driver_id (FK → users.id)
- vehicle_number (unique)
- pickup_address (text)
- pickup_latitude (decimal 9,6)
- pickup_longitude (decimal 9,6)
- drop_address (text)
- drop_latitude (decimal 9,6)
- drop_longitude (decimal 9,6)
- distance_km (decimal >0)
- price (decimal)
- pickup_date (date)
- pickup_time (time)
- available_seats (integer)
- status (enum: OPEN, SHARED, COMPLETED, CANCELLED)
- created_at
- updated_at

Business Logic:

1. Only vehicle owners can create booking.
2. vehicle_id must belong to driver_id.
3. limit for now only 1 seat capacity
4. status default = OPEN.
5. price = distance_km × 2.
6. pickup_date cannot be in the past.

------------------------------------------------------------

4.4 SHARED_RIDES TABLE

Purpose:
Stores passengers joining bookings.

Fields:

- id (UUID)
- booking_id (FK → bookings.id)
- passenger_id (FK → users.id)
- joined_at (timestamp)

Rules:

1. passenger_id must NOT equal driver_id.
2. booking.status must be OPEN.
3. available_seats must be > 0.
4. Use database transaction:
   - Insert shared_rides
   - Decrement available_seats
   - If first passenger → update status = SHARED
5. Unique constraint (booking_id, passenger_id).

------------------------------------------------------------
5. NEXT.JS APPLICATION STRUCTURE
------------------------------------------------------------

App Router Structure:

/app
  /login
  /dashboard
  /book
  /bookings
  /my-rides
  /api
      /auth
      /vehicles
      /bookings
      /shared-rides

------------------------------------------------------------
6. SCREEN SPECIFICATIONS
------------------------------------------------------------

6.1 LOGIN SCREEN (/login)

Fields:
- Phone number
- Send OTP
- OTP input
- Verify OTP

On success:
- Generate JWT
- Store in HTTP-only cookie
- Redirect to /dashboard

------------------------------------------------------------

6.2 DASHBOARD (/dashboard)

Display:

If user.is_vehicle_owner = true:
- Button: Book Ride

Always show:
- Button: View Available Bookings
- Button: My Rides

------------------------------------------------------------

6.3 CREATE BOOKING SCREEN (/book)

Visible only if user.is_vehicle_owner = true

Fields:
- Pickup location (Google Maps autocomplete)
- Drop location
- Pickup date
- Pickup time

System:
- Call Distance API
- Calculate distance_km
- price = distance_km × 2
- Set available_seats

Submit:
- Create booking
- Redirect to My Rides

------------------------------------------------------------

6.4 AVAILABLE BOOKINGS SCREEN (/bookings)

Query conditions:

- status = OPEN
- pickup_date >= today
- driver_id != current user

Display:

- Driver name
- Pickup location
- Drop location
- Pickup date
- Pickup time
- Price
- Available seats
- Join button

On Join:

- Execute transaction
- Insert into shared_rides
- Update booking status
- Decrement seats
- Remove booking from list

------------------------------------------------------------

6.5 MY RIDES SCREEN (/my-rides)

Sections:

1. Rides Created (as driver)
2. Rides Joined (as passenger)

------------------------------------------------------------
7. API ROUTES REQUIRED
------------------------------------------------------------

POST   /api/auth/send-otp
POST   /api/auth/verify-otp
GET    /api/user/me

POST   /api/vehicles

POST   /api/bookings
GET    /api/bookings?date=
POST   /api/bookings/{id}/join
GET    /api/my-rides

All routes require JWT middleware except auth routes.

------------------------------------------------------------
8. SECURITY REQUIREMENTS
------------------------------------------------------------

- JWT stored in HTTP-only cookie
- OTP expiry: 5 minutes
- Rate limit OTP attempts
- Validate ownership before booking creation
- Use DB transactions for seat updates
- Never expose Service Role Key to frontend
- .env must not be committed

------------------------------------------------------------
9. CONCURRENCY HANDLING
------------------------------------------------------------

When two users attempt to join same booking:

Use database transaction with row-level lock:

- SELECT FOR UPDATE booking
- Check available_seats
- Insert shared_rides
- Update booking
- Commit

Prevents overbooking.

------------------------------------------------------------
10. DEPLOYMENT NOTES
------------------------------------------------------------

Production:
- Host on Vercel
- Supabase as managed Postgres
- Environment variables configured in hosting dashboard
- Enable SSL
- Enable connection pooling if traffic increases

------------------------------------------------------------
END OF FULL STACK SPEC
------------------------------------------------------------