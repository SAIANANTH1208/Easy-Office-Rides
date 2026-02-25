'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '../components/Header'
import { Map, MapPin, Calendar, Clock, User, ArrowRight, Car } from 'lucide-react'
import Autocomplete from 'react-google-autocomplete'
import styles from './dashboard.module.css'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [rides, setRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Search States
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    // Check if user is logged in
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchAvailableRides()
      }
    }
    checkUser()
  }, [router])

  async function fetchAvailableRides() {
    setLoading(true)
    // Fetch all scheduled rides ordered by departure time
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        driver:profiles(full_name, avatar_url),
        vehicle:vehicles(make_model, color)
      `)
      .eq('status', 'scheduled')
      .gte('departure_time', new Date().toISOString()) // Only future rides
      .order('departure_time', { ascending: true })
      .limit(20)

    if (error) {
      console.error('Error fetching rides:', error)
    } else {
      setRides(data || [])
    }
    setLoading(false)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (date) params.set('date', date)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <div className={styles.container}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome, {user?.user_metadata?.name || 'Commuter'}! 👋</h1>
          <p className={styles.subtitle}>Ready to start your daily commute?</p>
        </div>

        {/* Start Booking Section */}
        <div className={styles.searchCard}>
          <h2 className={styles.sectionTitle}>Start Booking</h2>
          <div className={styles.searchGrid}>
            <div className={styles.inputGroup}>
              <Map className={styles.icon} size={20} />
              <Autocomplete
                apiKey={googleMapsApiKey}
                onPlaceSelected={(place) => setFrom(place.formatted_address || '')}
                onChange={(e: any) => setFrom(e.target.value)}
                options={{ types: ['geocode'], componentRestrictions: { country: "in" } }}
                placeholder="Pickup Location"
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <MapPin className={styles.icon} size={20} />
              <Autocomplete
                apiKey={googleMapsApiKey}
                onPlaceSelected={(place) => setTo(place.formatted_address || '')}
                onChange={(e: any) => setTo(e.target.value)}
                options={{ types: ['geocode'], componentRestrictions: { country: "in" } }}
                placeholder="Drop Location"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <Calendar className={styles.icon} size={20} />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <button className={styles.searchBtn} onClick={handleSearch}>
              Find Ride
            </button>
          </div>
        </div>

        {/* Available Rides Section */}
        <div className={styles.ridesSection}>
          <h2 className={styles.sectionTitle}>Available Rides</h2>
          
          {loading ? (
            <div className={styles.loading}>Loading available rides...</div>
          ) : rides.length === 0 ? (
            <div className={styles.empty}>
              <Car size={48} className={styles.emptyIcon} />
              <p>No rides scheduled right now. Be the first to post one!</p>
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
                      <span>{ride.available_seats} seats</span>
                    </div>
                  </div>

                  <button className={styles.bookBtn}>
                    Book Seat <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
