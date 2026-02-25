import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function isWithinBangalore(lat: number, lng: number) {
  return lat >= 12.73 && lat <= 13.17 && lng >= 77.38 && lng <= 77.82
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('adal_token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload
  try {
    payload = verifyAuthToken(token)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const pickupAddress = (body?.pickup_address || '').toString().trim()
  const dropAddress = (body?.drop_address || '').toString().trim()
  const pickupLat = Number(body?.pickup_latitude)
  const pickupLng = Number(body?.pickup_longitude)
  const dropLat = Number(body?.drop_latitude)
  const dropLng = Number(body?.drop_longitude)
  const date = (body?.departure_date || '').toString()
  const time = (body?.departure_time || '').toString()
  const availableSeats = Number(body?.available_seats || 1)
  const pricePerSeat = Number(body?.price_per_seat || 0)

  if (!pickupAddress || !dropAddress || !date || !time) {
    return NextResponse.json({ error: 'Pickup, drop, date, and time are required.' }, { status: 400 })
  }
  if (!isFinite(pickupLat) || !isFinite(pickupLng) || !isFinite(dropLat) || !isFinite(dropLng)) {
    return NextResponse.json({ error: 'Pickup and drop coordinates are required.' }, { status: 400 })
  }
  if (!isWithinBangalore(pickupLat, pickupLng) || !isWithinBangalore(dropLat, dropLng)) {
    return NextResponse.json({ error: 'Only Bangalore rides are allowed.' }, { status: 400 })
  }

  const departureTime = `${date}T${time}:00`

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id,is_vehicle_owner')
    .eq('id', payload.sub)
    .maybeSingle()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }
  if (!profile?.is_vehicle_owner) {
    return NextResponse.json({ error: 'Only vehicle owners can create rides.' }, { status: 403 })
  }

  const { data: ride, error } = await supabaseAdmin
    .from('rides')
    .insert({
      driver_id: payload.sub,
      origin: pickupAddress,
      destination: dropAddress,
      departure_time: departureTime,
      available_seats: availableSeats,
      price_per_seat: pricePerSeat,
      status: 'scheduled',
      pickup_latitude: pickupLat,
      pickup_longitude: pickupLng,
      drop_latitude: dropLat,
      drop_longitude: dropLng,
      pickup_address: pickupAddress,
      drop_address: dropAddress,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ride })
}
