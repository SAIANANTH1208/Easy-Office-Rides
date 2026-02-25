'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, User, Phone, Mail, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import styles from './signup.module.css'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    
    // Auto-add country code (+91) if missing for the metadata
    const formattedPhone = phone.trim().startsWith('+') ? phone.trim() : `+91${phone.trim()}`

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone: formattedPhone // Saving phone to metadata since it's required
        }
      }
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      // Check if email confirmation is required by Supabase settings
      alert('Signup successful! Please check your email to confirm your account.')
      router.push('/login')
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
          
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join us for daily commute sharing</p>

          {errorMsg && <p style={{color: '#e94560', textAlign: 'center', marginBottom: '16px', fontSize: '14px'}}>{errorMsg}</p>}
          
          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.inputGroup}>
              <User size={20} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
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
              <Phone size={20} className={styles.inputIcon} />
              <input
                type="tel"
                placeholder="Phone number (+91...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={18} />
            </button>
          </form>
          
          <p className={styles.switchText}>
            Already have an account? <Link href="/login" className={styles.switchLink}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
