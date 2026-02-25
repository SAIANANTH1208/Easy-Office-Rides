import { Suspense } from 'react'
import Header from '../components/Header'
import SearchContent from './SearchContent'
import styles from './search.module.css'

export default function SearchPage() {
  return (
    <div className={styles.page}>
      <Header />
      <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading search results...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  )
}
