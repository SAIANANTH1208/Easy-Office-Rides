import { Users, MapPin, Car } from 'lucide-react'
import styles from './Services.module.css'

const services = [
  {
    icon: Users,
    title: 'Daily Commute Sharing',
    description: 'Share your daily office ride with fellow commuters and save money while reducing traffic.'
  },
  {
    icon: MapPin,
    title: 'Route Matching',
    description: 'We match you with commuters traveling the same route for a comfortable journey.'
  },
  {
    icon: Car,
    title: 'Verified Riders',
    description: 'All riders are verified ensuring a safe and secure commute experience.'
  }
]

export default function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <h2 className={styles.title}>Daily Commute Sharing</h2>
        <p className={styles.subtitle}>Join our ride sharing platform and enjoy affordable daily commutes</p>
        
        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <service.icon size={32} />
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
