import styles from './Stats.module.css'

const stats = [
  { number: '5000+', label: 'Happy Customers' },
  { number: '200+', label: 'Premium Cars' },
  { number: '10+', label: 'Years Experience' }
]

export default function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.number}>{stat.number}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
