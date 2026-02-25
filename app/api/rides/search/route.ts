import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function isWithinBangalore(lat: number, lng: number) {
  return lat >= 12.73 && lat <= 13.17 && lng >= 77.38 && lng <= 77.82
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))
  const date = searchParams.get('date') || ''
  const time = searchParams.get('time') || ''

  if (!isFinite(lat) || !isFinite(lng)) {
    return NextResponse.json({ error: 'Pickup coordinates are required.' }, { status: 400 })
  }
  if (!isWithinBangalore(lat, lng)) {
    return NextResponse.json({ error: 'Only Bangalore rides are allowed.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('rides')
    .select('*')
    .eq('status', 'scheduled')
    .gt('available_seats', 0)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const dateFilter = date ? new Date(`${date}T00:00:00`) : null
  const dateEnd = date ? new Date(`${date}T23:59:59`) : null
  const timeFilter = date && time ? new Date(`${date}T${time}:00`) : null

  const rides = (data || []).filter((r) => {
    if (typeof r.pickup_latitude !== 'number' || typeof r.pickup_longitude !== 'number') return false
    const dist = haversineKm(lat, lng, r.pickup_latitude, r.pickup_longitude)
    if (dist > 4) return false
    if (dateFilter && dateEnd) {
      const t = new Date(r.departure_time)
      if (t < dateFilter || t > dateEnd) return false
    }
    if (timeFilter) {
      const t = new Date(r.departure_time)
      if (t < timeFilter) return false
    }
    return true
  })

  return NextResponse.json({ rides })
}
