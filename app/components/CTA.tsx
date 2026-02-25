import styles from './CTA.module.css'

export default function CTA() {
  return (
    <section id="cta" className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.title}>Book Your Ride Today</h2>
        <p className={styles.subtitle}>
          Experience premium corporate car rental services in Bangalore. 
          Contact us now for bookings and inquiries.
        </p>
        <a href="tel:+919999999999" className={styles.button}>
          Call Now
        </a>
      </div>
    </section>
  )
}
