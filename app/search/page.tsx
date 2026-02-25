'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MapPin, Calendar, Clock, User, ArrowRight, Car } from 'lucide-react'
import Header from '../components/Header'
import styles from './search.module.css'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')

  const [rides, setRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRides() {
      setLoading(true)
      console.log('Searching for rides:', { from, to, date })
      
      let query = supabase
        .from('rides')
        .select(`
          *,
          driver:profiles(full_name, avatar_url),
          vehicle:vehicles(make_model, color)
        `)
        .eq('status', 'scheduled')

      // Simple text matching for now (PostGIS would be better for real geo-search)
      if (from) {
        query = query.ilike('origin', `%${from}%`)
      }
      if (to) {
        query = query.ilike('destination', `%${to}%`)
      }
      
      // If date is provided, filter by date (ignoring time for this demo)
      if (date) {
        // This is a simple check, in production use proper date range comparison
        query = query.gte('departure_time', `${date}T00:00:00`).lte('departure_time', `${date}T23:59:59`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching rides:', error)
      } else {
        setRides(data || [])
      }
      setLoading(false)
    }

    fetchRides()
  }, [from, to, date])

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Available Rides</h1>
          <p className={styles.subtitle}>
            Showing rides from <strong>{from || 'Anywhere'}</strong> to <strong>{to || 'Anywhere'}</strong>
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading rides...</div>
        ) : rides.length === 0 ? (
          <div className={styles.empty}>
            <Car size={48} className={styles.emptyIcon} />
            <h3>No rides found</h3>
            <p>Try searching for a different location or date.</p>
            <Link href="/" className={styles.backBtn}>Back to Home</Link>
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
                      <div className={styles.driverName}>{ride.driver?.full_name || 'Unknown Driver'}</div>
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
                    <span>{new Date(ride.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
    </div>
  )
}
