import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import Badge from '../components/Badge'
import StallIcon from '../components/StallIcon'
import { Mail, AlertCircle, Check, X, Clock, Lock as LockIcon, User, Search, Bell, Settings, LogOut } from 'lucide-react'

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-display font-bold text-text mb-2">SpaceBook Design System</h1>
        <p className="text-muted text-lg mb-12">Clean, modern, and trustworthy event stall booking platform</p>
        
        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Color Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'bg', color: '#F7F9F8' },
              { name: 'surface', color: '#FFFFFF' },
              { name: 'surface-2', color: '#F0F4F2' },
              { name: 'border', color: '#E0E8E4' },
              { name: 'border-strong', color: '#C8D4CE' },
              { name: 'text', color: '#1A2E2A' },
              { name: 'muted', color: '#6B7F7B' },
              { name: 'green', color: '#A8E6CF' },
              { name: 'green-strong', color: '#2D8A6E' },
              { name: 'green-soft', color: '#E8F7F2' },
              { name: 'orange', color: '#FFD3B6' },
              { name: 'orange-strong', color: '#C67D4E' },
              { name: 'orange-soft', color: '#FFF2E8' },
              { name: 'red', color: '#FF8B94' },
              { name: 'red-strong', color: '#C44D57' },
              { name: 'red-soft', color: '#FFE8EB' },
            ].map((color) => (
              <div key={color.name} className="flex flex-col gap-2">
                <div 
                  className="w-full h-20 rounded-xl border border-border shadow-subtle"
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-sm font-mono text-muted">{color.name}</span>
                <span className="text-xs font-mono text-muted">{color.color}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Typography</h2>
          <div className="space-y-6">
            <div>
              <span className="text-6xl font-display font-bold text-text">Display 56px - Inter 800</span>
            </div>
            <div>
              <span className="text-5xl font-display font-bold text-text">Display 48px - Inter 700</span>
            </div>
            <div>
              <span className="text-4xl font-display font-bold text-text">Display 32px - Inter 600</span>
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-text">Display 24px - Inter 600</span>
            </div>
            <div>
              <span className="text-xl font-display font-bold text-text">Display 18px - Inter 600</span>
            </div>
            <div>
              <span className="text-lg font-body font-semibold text-text">Body 18px Semibold - Inter 600</span>
            </div>
            <div>
              <span className="text-base font-body font-medium text-text">Body 16px Medium - Inter 500</span>
            </div>
            <div>
              <span className="text-sm font-body font-medium text-text">Body 14px Medium - Inter 500</span>
            </div>
            <div>
              <span className="text-xs font-body font-medium text-text">Body 12px Medium - Inter 500</span>
            </div>
            <div>
              <span className="text-base font-mono text-text">Monospace 16px - JetBrains Mono 400</span>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Buttons</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Primary</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="small">Primary Small</Button>
                <Button variant="primary" size="medium">Primary Medium</Button>
                <Button variant="primary" size="large">Primary Large</Button>
                <Button variant="primary" size="medium" loading>Loading</Button>
                <Button variant="primary" size="medium" disabled>Disabled</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Secondary</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="secondary" size="small">Secondary Small</Button>
                <Button variant="secondary" size="medium">Secondary Medium</Button>
                <Button variant="secondary" size="large">Secondary Large</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Ghost</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="ghost" size="small">Ghost Small</Button>
                <Button variant="ghost" size="medium">Ghost Medium</Button>
                <Button variant="ghost" size="large">Ghost Large</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Danger</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="danger" size="small">Danger Small</Button>
                <Button variant="danger" size="medium">Danger Medium</Button>
                <Button variant="danger" size="large">Danger Large</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Default States</h3>
              <div className="space-y-4">
                <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="w-5 h-5" />} />
                <Input label="Password" type="password" placeholder="••••••••" showPasswordToggle />
                <Input label="With helper" helper="Use a strong password" placeholder="Enter value" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Error States</h3>
              <div className="space-y-4">
                <Input label="Email" error="This field is required" placeholder="Enter email" />
                <Input label="Password" error="Password must be at least 10 characters" placeholder="Enter password" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Disabled State</h3>
              <Input label="Disabled field" disabled placeholder="Cannot edit" />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="small">
              <h3 className="text-lg font-display font-bold text-text mb-2">Small Padding</h3>
              <p className="text-muted">Card with small padding</p>
            </Card>
            <Card padding="medium">
              <h3 className="text-lg font-display font-bold text-text mb-2">Medium Padding</h3>
              <p className="text-muted">Card with medium padding</p>
            </Card>
            <Card padding="large">
              <h3 className="text-lg font-display font-bold text-text mb-2">Large Padding</h3>
              <p className="text-muted">Card with large padding</p>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Badges</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Solid Variants</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge variant="green" size="small">Available</Badge>
                <Badge variant="green" size="medium">Available</Badge>
                <Badge variant="orange" size="small">Pending</Badge>
                <Badge variant="orange" size="medium">Pending</Badge>
                <Badge variant="red" size="small">Booked</Badge>
                <Badge variant="red" size="medium">Booked</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Outline Variants</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge variant="green" outline size="medium">Approved</Badge>
                <Badge variant="orange" outline size="medium">Requested</Badge>
                <Badge variant="red" outline size="medium">Rejected</Badge>
                <Badge variant="gray" size="medium">Cancelled</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Booking Status Badges with Icons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge variant="orange" outline size="medium">
                  <Clock className="w-4 h-4" />
                  Requested
                </Badge>
                <Badge variant="green" size="medium">
                  <Check className="w-4 h-4" />
                  Approved
                </Badge>
                <Badge variant="red" size="medium">
                  <X className="w-4 h-4" />
                  Rejected
                </Badge>
                <Badge variant="gray" size="medium">
                  <AlertCircle className="w-4 h-4" />
                  Cancelled
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Stall Status */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Stall Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card padding="medium" className="text-center">
              <StallIcon color="green" size={64} />
              <h3 className="text-lg font-display font-bold text-green-strong mb-1 mt-4">Available</h3>
              <p className="text-sm text-muted">Can be booked</p>
            </Card>
            <Card padding="medium" className="text-center">
              <StallIcon color="orange" size={64} />
              <h3 className="text-lg font-display font-bold text-orange-strong mb-1 mt-4">Pending</h3>
              <p className="text-sm text-muted">Awaiting approval</p>
            </Card>
            <Card padding="medium" className="text-center relative overflow-hidden">
              <div className="absolute inset-0 diagonal-hatch opacity-30" />
              <StallIcon color="red" size={64} />
              <h3 className="text-lg font-display font-bold text-red-strong mb-1 mt-4 relative z-10">Booked</h3>
              <p className="text-sm text-muted relative z-10">Not available</p>
            </Card>
            <Card padding="medium" className="text-center shadow-medium">
              <div className="w-16 h-16 rounded-2xl bg-surface border-2 border-text mx-auto mb-4 flex items-center justify-center shadow-subtle">
                <Check className="w-8 h-8 text-green-strong" />
              </div>
              <h3 className="text-lg font-display font-bold text-text mb-1">Selected</h3>
              <p className="text-sm text-muted">Currently selected</p>
            </Card>
          </div>
        </section>

        {/* Avatar */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Avatar</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="w-10 h-10 rounded-full bg-green-soft flex items-center justify-center text-green-strong font-display font-bold text-lg">
              JD
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-soft flex items-center justify-center text-orange-strong font-display font-bold text-xl">
              AB
            </div>
            <div className="w-14 h-14 rounded-full bg-red-soft flex items-center justify-center text-red-strong font-display font-bold text-2xl">
              XY
            </div>
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-muted font-display font-bold text-2xl border border-border">
              Z
            </div>
          </div>
        </section>

        {/* Icon Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-text mb-6">Icons (Lucide)</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex flex-col items-center gap-2">
              <User className="w-6 h-6 text-muted" />
              <span className="text-xs text-muted">User</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="w-6 h-6 text-muted" />
              <span className="text-xs text-muted">Mail</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Search className="w-6 h-6 text-muted" />
              <span className="text-xs text-muted">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Bell className="w-6 h-6 text-muted" />
              <span className="text-xs text-muted">Bell</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Settings className="w-6 h-6 text-muted" />
              <span className="text-xs text-muted">Settings</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LogOut className="w-6 h-6 text-muted" />
              <span className="text-xs text-muted">LogOut</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Check className="w-6 h-6 text-green-strong" />
              <span className="text-xs text-muted">Check</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <X className="w-6 h-6 text-red-strong" />
              <span className="text-xs text-muted">X</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-6 h-6 text-orange-strong" />
              <span className="text-xs text-muted">Clock</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LockIcon className="w-6 h-6 text-red-strong" />
              <span className="text-xs text-muted">Lock</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
