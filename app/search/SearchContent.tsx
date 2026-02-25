'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Clock, User, ArrowRight, Car } from 'lucide-react'
import styles from './search.module.css'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')
  const time = searchParams.get('time')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  const [rides, setRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRides() {
      setLoading(true)

      const params = new URLSearchParams()
      if (lat) params.set('lat', lat)
      if (lng) params.set('lng', lng)
      if (date) params.set('date', date)
      if (time) params.set('time', time)

      const res = await fetch(`/api/rides/search?${params.toString()}`)
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        console.error('Error fetching rides:', payload?.error || 'Unknown error')
        setRides([])
      } else {
        setRides(payload.rides || [])
      }
      setLoading(false)
    }

    fetchRides()
  }, [from, to, date, time, lat, lng])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Available Rides</h1>
        <p className={styles.subtitle}>
          Showing rides from <strong>{from || 'Anywhere'}</strong> to{' '}
          <strong>{to || 'Anywhere'}</strong>
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading rides...</div>
      ) : rides.length === 0 ? (
        <div className={styles.empty}>
          <Car size={48} className={styles.emptyIcon} />
          <h3>No rides found</h3>
          <p>Try searching for a different location or date.</p>
          <Link href="/" className={styles.backBtn}>
            Back to Home
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {rides.map((ride) => (
            <div key={ride.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.driverInfo}>
                  <div className={styles.avatar}>
                    {ride.driver?.full_name?.charAt(0) || <User size={20} />}
                  </div>
                  <div>
                    <div className={styles.driverName}>
                      {ride.driver?.full_name || 'Unknown Driver'}
                    </div>
                    <div className={styles.vehicleInfo}>
                      {ride.vehicle?.color} {ride.vehicle?.make_model}
                    </div>
                  </div>
                </div>
                <div className={styles.price}>₹{ride.price_per_seat}</div>
              </div>

              <div className={styles.route}>
                <div className={styles.routeItem}>
                  <div className={styles.dot} />
                  <span className={styles.location}>{ride.origin}</span>
                </div>
                <div className={styles.line} />
                <div className={styles.routeItem}>
                  <MapPin size={16} className={styles.pinIcon} />
                  <span className={styles.location}>{ride.destination}</span>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <Calendar size={16} />
                  <span>{new Date(ride.departure_time).toLocaleDateString()}</span>
                </div>
                <div className={styles.detailItem}>
                  <Clock size={16} />
                  <span>
                    {new Date(ride.departure_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <User size={16} />
                  <span>{ride.available_seats} seats left</span>
                </div>
              </div>

              <button className={styles.bookBtn}>
                Request Seat <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
