import { Search, CheckCircle, Car } from 'lucide-react'
import styles from './HowItWorks.module.css'

const steps = [
  {
    icon: Search,
    title: '1. Search Your Route',
    description: 'Enter your pickup and drop-off locations to find colleagues and commuters traveling your way.'
  },
  {
    icon: CheckCircle,
    title: '2. Book & Confirm',
    description: 'Review verified profiles and book a seat instantly or request to join their daily ride.'
  },
  {
    icon: Car,
    title: '3. Ride & Save',
    description: 'Meet at the designated spot, enjoy a comfortable commute, and split the costs seamlessly.'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>How It Works</h2>
        <p className={styles.subtitle}>Three simple steps to a better daily commute</p>

        <div className={styles.grid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <step.icon size={32} />
              </div>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
