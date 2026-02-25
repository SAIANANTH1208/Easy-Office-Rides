'use client'

import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Intentionally left empty on left side to match image */}
        <div className={styles.spacer}></div>
        
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/#how-it-works" className={styles.navLink}>How It Works</Link>
          <Link href="/#about" className={styles.navLink}>About</Link>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/signup" className={styles.signupBtn}>Sign Up</Link>
        </nav>
      </div>
    </header>
  )
}
