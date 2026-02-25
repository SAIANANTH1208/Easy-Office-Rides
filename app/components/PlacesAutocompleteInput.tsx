'use client'

import { useEffect, useRef } from 'react'

type PlaceResult = {
  address: string
  lat?: number
  lng?: number
}

type Props = {
  apiKey?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onPlaceSelected: (place: PlaceResult) => void
  className?: string
}

export default function PlacesAutocompleteInput({
  apiKey,
  value,
  placeholder,
  onChange,
  onPlaceSelected,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!apiKey || !inputRef.current) return

    const scriptId = 'google-maps-places'
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null

    function attachAutocomplete() {
      if (!inputRef.current) return
      const g = (window as any).google
      if (!g?.maps?.places) return
      const autocomplete = new g.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' },
        fields: ['formatted_address', 'geometry'],
      })
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        const address = place?.formatted_address || ''
        const location = place?.geometry?.location
        const lat = typeof location?.lat === 'function' ? location.lat() : undefined
        const lng = typeof location?.lng === 'function' ? location.lng() : undefined
        if (address) onPlaceSelected({ address, lat, lng })
      })
    }

    if (existing) {
      if ((window as any).google?.maps?.places) {
        attachAutocomplete()
      } else {
        existing.addEventListener('load', attachAutocomplete, { once: true })
      }
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = attachAutocomplete
    document.head.appendChild(script)
  }, [apiKey, onPlaceSelected])

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  )
}
