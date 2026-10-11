import React from 'react'

interface StallIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: number
}

/**
 * Distinctive Market-Stall Canopy Vector Icon for SpaceBook
 * Represents an expo booth / market stall canopy with awning, posts, and display counter.
 */
export default function StallIcon({ className = 'w-6 h-6', size, ...props }: StallIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {/* Canopy Awning Roof */}
      <path d="M3 8.5L5.5 3h13L21 8.5" />
      {/* Scalloped Awning Front Valence */}
      <path d="M3 8.5c0 1.2 1 2 2.25 2s2.25-.8 2.25-2c0 1.2 1 2 2.25 2s2.25-.8 2.25-2c0 1.2 1 2 2.25 2s2.25-.8 2.25-2c0 1.2 1 2 2.25 2s2.25-.8 2.25-2" />
      {/* Awning Fabric Stripe Details */}
      <path d="M7.75 3.2L6.5 8.5" strokeWidth="1.5" opacity="0.6" />
      <path d="M12 3v5.5" strokeWidth="1.5" opacity="0.6" />
      <path d="M16.25 3.2L17.5 8.5" strokeWidth="1.5" opacity="0.6" />
      {/* Booth Frame Support Posts */}
      <path d="M4.5 10.5V21" />
      <path d="M19.5 10.5V21" />
      {/* Counter Table */}
      <rect x="4.5" y="14" width="15" height="4" rx="0.5" fill="currentColor" fillOpacity="0.2" />
      {/* Table Frame Accent */}
      <path d="M4.5 14h15" />
      <path d="M4.5 18h15" />
      <path d="M8 18v3" />
      <path d="M16 18v3" />
    </svg>
  )
}

export { StallIcon }
