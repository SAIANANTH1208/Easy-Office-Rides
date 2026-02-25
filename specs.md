# Easy Office Rides - Landing Page Specification

## 1. Project Overview

- **Project Name**: Easy Office Rides
- **Type**: Corporate Car Rental Landing Page (Next.js)
- **Core Functionality**: Showcase premium corporate car rental services in Bangalore with booking CTA
- **Target Users**: Corporate clients, business travelers, professionals needing airport transfers and daily commutes

## 2. UI/UX Specification

### Layout Structure
- **Header**: Fixed navigation with logo and menu links
- **Hero**: Full-width hero with headline, subtext, and CTA button
- **Features**: 3-column grid showcasing key features
- **Stats**: Counter section with key metrics
- **Why Choose Us**: 4-column grid of benefits
- **Services**: Grid of service offerings
- **CTA Section**: Call-to-action for bookings
- **Footer**: Contact info, links, and copyright

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (full layout)

### Visual Design

#### Color Palette
- Primary: `#1a1a2e` (Dark Navy)
- Secondary: `#e94560` (Coral Red)
- Accent: `#0f3460` (Deep Blue)
- Background: `#ffffff` (White)
- Text Primary: `#1a1a2e`
- Text Secondary: `#666666`
- Light Background: `#f8f9fa`

#### Typography
- Headings: 'Poppins', sans-serif (700 weight)
- Body: 'Inter', sans-serif (400, 500 weight)
- Hero Title: 56px (desktop), 36px (mobile)
- Section Titles: 36px (desktop), 28px (mobile)
- Body Text: 16px
- Small Text: 14px

#### Spacing
- Section Padding: 80px vertical (desktop), 48px (mobile)
- Container Max Width: 1200px
- Grid Gap: 32px
- Card Padding: 32px

### Components

#### Header
- Logo (text-based: "Easy Office Rides")
- Navigation: Home, Services, About, Contact
- Mobile: Hamburger menu
- Sticky on scroll with shadow

#### Hero Section
- Background: Gradient overlay on light gray
- Headline: "Premium Corporate Car Rental Solutions in Bangalore"
- Subtext: "Reliable, comfortable, and professional transportation for your business needs"
- CTA Button: "Book Now" (Coral Red)

#### Feature Cards
- Icon (using Lucide React icons)
- Title
- Description
- Hover: subtle lift effect

#### Stats Section
- 3 stat items in row
- Large numbers with labels
- Background: Primary color with white text

#### Service Cards
- Icon
- Service name
- Brief description
- Hover: border color change

#### Footer
- Logo and tagline
- Quick links
- Contact info
- Social icons (placeholder)
- Copyright

## 3. Functionality Specification

### Core Features
- Responsive navigation with mobile menu
- Smooth scroll to sections
- Hover animations on cards and buttons
- Animated counter for stats (optional enhancement)
- Clean, professional aesthetic matching the original image

### User Interactions
- Navigation clicks scroll to sections
- CTA buttons could link to contact/booking (placeholder)
- Mobile menu toggle

### Data Handling
- Static content (no backend)
- All content hardcoded

## 4. Acceptance Criteria

- [ ] Page loads without errors
- [ ] All sections match the original image layout
- [ ] Responsive on mobile, tablet, desktop
- [ ] Colors match specification
- [ ] Fonts load correctly (Poppins, Inter)
- [ ] Navigation works (smooth scroll)
- [ ] Mobile menu functions
- [ ] Hover effects on interactive elements
- [ ] No console errors

## 5. Tech Stack

- Next.js 14+ (App Router)
- React 18
- TypeScript
- Lucide React (icons)
- CSS Modules or Tailwind CSS
- Google Fonts (Poppins, Inter)
