# SpaceBook Design System - Fresh Build

## Design Philosophy
Clean, modern, and trustworthy. The interface should feel like a premium SaaS product for event management - professional but approachable, with clear visual hierarchy and generous whitespace.

## Color Palette

### Primary Colors (Soft Pastels)
- **Primary Green**: `#A8E6CF` - Primary actions, success states, available stalls
- **Primary Orange**: `#FFD3B6` - Accent actions, pending states, warnings
- **Primary Blue**: `#A8D4E6` - Secondary actions, organizer elements
- **Primary Red**: `#FF8B94` - Danger actions, rejected, booked states

### Neutral Colors
- **Background**: `#F7F9F8` - Page background (very light grey-green)
- **Surface**: `#FFFFFF` - Cards, panels, inputs
- **Surface 2**: `#F0F4F2` - Subtle fills, table headers, hover states
- **Border**: `#E0E8E4` - Standard borders
- **Border Strong**: #C8D4CE` - Emphasized borders, focus states
- **Text**: `#1A2E2A` - Primary text (deep dark green-grey)
- **Muted**: `#6B7F7B` - Secondary text

### Strong Variants (for text and icons on light backgrounds)
- **Green Strong**: `#2D8A6E` - Links, icons, text on white
- **Orange Strong**: `#C67D4E` - Links, icons, text on white
- **Red Strong**: `#C44D57` - Links, icons, text on white

### Soft Variants (for backgrounds and badges)
- **Green Soft**: `#E8F7F2` - Backgrounds, badges, available stalls
- **Orange Soft**: `#FFF2E8` - Backgrounds, badges, pending stalls
- **Red Soft**: `#FFE8EB` - Backgrounds, badges, booked stalls

### On Accent
- **On Accent**: `#1A2E2A` - Text on pastel fills

## Typography

### Font Families
- **Display**: Inter (600, 700, 800) - Headings, logos, large numbers
- **Body**: Inter (400, 500, 600) - UI text, body copy
- **Mono**: JetBrains Mono (400, 500) - Numbers, IDs, prices, timestamps

Using Inter for both display and body for consistency and modern feel.

### Type Scale
- 56px - Hero H1 (clamp(40px, 6vw, 64px))
- 48px - Large headings
- 32px - Section headings
- 24px - Subsection headings
- 18px - Large body, subtitles
- 16px - Base body text (line-height 1.6)
- 14px - Small body, labels
- 12px - Tiny text, captions

### Tracking
- Normal tracking (0) on all sizes
- Tight tracking (-0.01em) on display sizes 32px and above

## Spacing System
8px grid: 4, 8, 12, 16, 24, 32, 40, 48, 64, 96, 128px

## Border Radius
- 8px - Small elements
- 12px - Inputs, buttons
- 16px - Cards
- 20px - Dialogs, modals
- 999px - Pills, badges

## Elevation (Shadows)
- **Subtle**: `0 1px 3px rgba(26, 46, 42, 0.08), 0 4px 12px rgba(26, 46, 42, 0.04)`
- **Medium**: `0 2px 6px rgba(26, 46, 42, 0.1), 0 8px 20px rgba(26, 46, 42, 0.06)`
- **Strong**: `0 4px 12px rgba(26, 46, 42, 0.12), 0 16px 32px rgba(26, 46, 42, 0.08)`

## Motion
- Duration: 200-300ms ease-out
- Transitions: hover, focus, dialogs, drawers
- Page entry: gentle fade (200ms)
- Respect `prefers-reduced-motion`

## Layout
- Max content width: 1200px
- Page gutters: 24px (16px on mobile)
- 8px spacing grid throughout

## Component Specifications

### Button
- Height: 44px (36px small, 52px large)
- Radius: 12px
- Weight: 600
- Focus ring: 2px green-strong at 30% opacity
- Hover: translateY(-1px)
- Loading: spinner icon
- Disabled: opacity 50%

### Input / Select / Textarea
- Height: 48px
- Background: white
- Border: 1px border-strong
- Radius: 12px
- Padding: 14px/16px
- Label: 14px 600, always visible above input
- Helper text: below input
- Error: red border + message + icon
- Disabled: muted text
- Focus: 2px green ring

### Password Input
- Eye button: 40px square inside field
- Icons: Eye / EyeOff (Lucide)
- Accessible: aria-label, aria-pressed
- Keyboard operable

### Card
- Background: white
- Border: 1px border
- Radius: 16px
- Shadow: subtle
- Padding: 24px (small), 32px (medium), 40px (large)

### Badge
- Radius: 999px (pill)
- Padding: 6px 12px (small), 8px 16px (medium)
- Font: 12px (small), 14px (medium)
- Weight: 500

### Status Indicators

#### Stall Status
- **Available**: green-soft fill, green-strong 1.5px border, dot icon
- **Pending**: orange-soft fill, orange-strong border, clock icon
- **Booked**: red-soft fill with diagonal hatch, red-strong border, lock icon, not selectable
- **Selected**: white fill, 2px text ring with subtle shadow, check-badge corner, "Selected" label

#### Booking Badges
- **Requested**: outlined pill, orange, clock icon
- **Approved**: solid green pill, check icon
- **Rejected**: solid red pill, X icon
- **Cancelled**: outlined gray pill, slash icon

## Stall Illustration Style
Real festival stalls with:
- Striped scalloped awning (3 colors: green, orange, red)
- Vertical posts at corners
- Open front showing counter
- Simple goods on counter (boxes, crates)
- Clear perspective that shows it's a bookable stall
- 56px minimum size for touch targets

## Accessibility
- All text/background pairs meet WCAG AA
- Visible focus states on all interactive elements
- Semantic landmarks
- Labelled inputs
- aria-live for toasts and validation
- Keyboard accessible everywhere
- Tap targets minimum 44px

## Responsive Breakpoints
- 360px - Mobile small
- 768px - Tablet
- 1280px - Desktop
- 1536px - Desktop large

## Signature Visual Elements
1. **Scalloped Awnings**: Striped, scalloped-edge festival stall awnings
2. **Diagonal Hatch Pattern**: For booked stalls (repeating diagonal lines)
3. **Soft Shadows**: Layered, multi-shadow elevation system
4. **Rounded Corners**: Consistent 8-20px radius system
5. **Green-Neutral Base**: Slight green tint to neutrals for warmth
