'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, Mail, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard') // Redirect to dashboard on success
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <Link href="/" className={styles.logo}>
            <Car size={32} />
            <span>Easy Office Rides</span>
          </Link>
          
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Login with your email</p>

          {errorMsg && <p style={{color: '#e94560', textAlign: 'center', marginBottom: '16px', fontSize: '14px'}}>{errorMsg}</p>}
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <Mail size={20} className={styles.inputIcon} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'} <ArrowRight size={18} />
            </button>
          </form>
          
          <p className={styles.switchText}>
            Don&apos;t have an account? <Link href="/signup" className={styles.switchLink}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
