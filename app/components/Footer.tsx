import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>Easy Office Rides</h3>
            <p className={styles.tagline}>
              Premium corporate car rental solutions in Bangalore. Reliable, comfortable, and professional transportation for your business needs.
            </p>
          </div>
          
          <div className={styles.links}>
            <h4 className={styles.heading}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#why-choose-us">About</a></li>
              <li><a href="#cta">Contact</a></li>
            </ul>
          </div>
          
          <div className={styles.contact}>
            <h4 className={styles.heading}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={18} />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li>
                <Phone size={18} />
                <a href="tel:+919999999999">+91 99999 99999</a>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:info@easyofficerides.com">info@easyofficerides.com</a>
              </li>
            </ul>
          </div>
          
          <div className={styles.social}>
            <h4 className={styles.heading}>Follow Us</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Easy Office Rides. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
