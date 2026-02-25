'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Map, MapPin, Calendar } from 'lucide-react'
import Autocomplete from 'react-google-autocomplete'
import styles from './Hero.module.css'

export default function Hero() {
  const router = useRouter()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')

  const handleSearch = () => {
    // Create query string
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (date) params.set('date', date)
    
    router.push(`/search?${params.toString()}`)
  }

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <section className={styles.hero}>
      <div className={styles.leftImage}></div>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Easy Office Rides<br/>in Bangalore</h1>
          <p className={styles.subtitle}>Share your ride to work and save money!</p>
          
          <div className={styles.searchCard}>
            <div className={styles.inputRow}>
              <Map className={styles.icon} size={24} />
              <Autocomplete
                apiKey={googleMapsApiKey}
                onPlaceSelected={(place) => setFrom(place.formatted_address || '')}
                onChange={(e: any) => setFrom(e.target.value)}
                options={{
                  types: ['geocode'],
                  componentRestrictions: { country: "in" },
                }}
                placeholder="Pickup Location"
                className={styles.input}
                defaultValue={from}
              />
            </div>
            
            <div className={styles.divider} />
            
            <div className={styles.inputRow}>
              <MapPin className={styles.icon} size={24} />
              <Autocomplete
                apiKey={googleMapsApiKey}
                onPlaceSelected={(place) => setTo(place.formatted_address || '')}
                onChange={(e: any) => setTo(e.target.value)}
                options={{
                  types: ['geocode'],
                  componentRestrictions: { country: "in" },
                }}
                placeholder="Drop Location"
                className={styles.input}
                defaultValue={to}
              />
            </div>
            
            <div className={styles.divider} />
            
            <div className={styles.bottomRow}>
              <div className={styles.dateWrapper}>
                <Calendar className={styles.icon} size={24} />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={styles.input} 
                  style={{color: '#333'}}
                />
              </div>
              <button className={styles.findBtn} onClick={handleSearch}>
                Find Ride
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
