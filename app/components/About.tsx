import { Target, Leaf, Users, Shield } from 'lucide-react'
import styles from './About.module.css'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To simplify daily office commutes in Bangalore by connecting professionals on shared routes.'
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Fewer cars on the road means less traffic congestion and a much smaller carbon footprint.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Network with fellow professionals and make your daily travel a more social, enjoyable experience.'
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Every user is verified through their phone number and corporate details for your peace of mind.'
  }
]

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>About Easy Office Rides</h2>
          <p className={styles.subtitle}>
            We are Bangalore's dedicated corporate carpooling network. 
            Born out of the frustration of notorious traffic jams, we created a platform 
            where colleagues and corporate neighbors can share rides, split costs, and build a greener city together.
          </p>
        </div>
        
        <div className={styles.grid}>
          {values.map((value, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <value.icon size={28} />
              </div>
              <h3 className={styles.cardTitle}>{value.title}</h3>
              <p className={styles.cardDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
