import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import StallIcon from '../../components/StallIcon'
import { Clock, CheckCircle, XCircle, Loader2, Filter } from 'lucide-react'

interface AuditLog {
  id: number
  action: string
  entityType: string
  entityId: number
  actorName: string
  actorRole: string
  timestamp: string
  details?: string
}

export default function AuditHistory() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filterAction, setFilterAction] = useState('all')
  const [filterEntityType, setFilterEntityType] = useState('all')

  useEffect(() => {
    // Placeholder data - would come from backend API
    setLogs([
      {
        id: 1,
        action: 'BOOKING_APPROVED',
        entityType: 'Booking',
        entityId: 101,
        actorName: 'John Organizer',
        actorRole: 'ORGANIZER',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: 'Approved booking request for stall A1',
      },
      {
        id: 2,
        action: 'BOOKING_REQUESTED',
        entityType: 'Booking',
        entityId: 101,
        actorName: 'Jane Vendor',
        actorRole: 'VENDOR',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: 'Requested booking for stall A1',
      },
      {
        id: 3,
        action: 'EVENT_CREATED',
        entityType: 'Event',
        entityId: 1,
        actorName: 'John Organizer',
        actorRole: 'ORGANIZER',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        details: 'Created Summer Food Festival 2024',
      },
      {
        id: 4,
        action: 'STALL_CREATED',
        entityType: 'Stall',
        entityId: 15,
        actorName: 'Arun Verma (Organizer)',
        actorRole: 'ORGANIZER',
        timestamp: new Date(Date.now() - 90000000).toISOString(),
        details: 'Created stall A1 with pricing ₹25,000 at BIEC Bengaluru',
      },
    ])
    setLoading(false)
  }, [])

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction
    const matchesEntity = filterEntityType === 'all' || log.entityType === filterEntityType
    return matchesAction && matchesEntity
  })

  const getActionIcon = (action: string) => {
    if (action.includes('APPROVED') || action.includes('CREATED')) {
      return <CheckCircle className="w-5 h-5 text-green-strong" />
    }
    if (action.includes('REJECTED') || action.includes('DELETED')) {
      return <XCircle className="w-5 h-5 text-red-strong" />
    }
    return <Clock className="w-5 h-5 text-blue-strong" />
  }

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('CREATED')) return 'green'
    if (action.includes('REJECTED') || action.includes('DELETED')) return 'red'
    return 'blue'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAction = (action: string) => {
    return action.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')
  }

  const actions = ['all', ...Array.from(new Set(logs.map(l => l.action)))]
  const entityTypes = ['all', ...Array.from(new Set(logs.map(l => l.entityType)))]

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/organizer/dashboard" className="flex items-center gap-2">
            <StallIcon color="accent" size={32} />
            <span className="text-2xl font-display font-bold text-text">SpaceBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/organizer/events">
              <Button variant="ghost" size="small">My Events</Button>
            </Link>
            <Link to="/organizer/bookings">
              <Button variant="ghost" size="small">Booking Requests</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation without back arrow */}
          <div className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link to="/organizer/dashboard" className="hover:text-white transition-colors">
              Operations Center
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Audit History</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-text mb-2">Audit History</h1>
            <p className="text-muted">Track all important actions in the system</p>
          </div>

          {/* Filters */}
          <Card padding="medium" className="mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-text">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                >
                  {actions.map(action => (
                    <option key={action} value={action}>
                      {action === 'all' ? 'All Actions' : formatAction(action)}
                    </option>
                  ))}
                </select>
                <select
                  value={filterEntityType}
                  onChange={(e) => setFilterEntityType(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary-strong/30"
                >
                  {entityTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Entities' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Audit Logs */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-muted animate-spin" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <Card padding="large" className="text-center">
              <div className="py-12">
                <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted" />
                </div>
                <h3 className="text-xl font-display font-bold text-text mb-2">No audit logs found</h3>
                <p className="text-muted mb-4">
                  {filterAction !== 'all' || filterEntityType !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No activity recorded yet'
                  }
                </p>
                {(filterAction !== 'all' || filterEntityType !== 'all') && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setFilterAction('all')
                      setFilterEntityType('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map(log => (
                <Card key={log.id} padding="medium">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
                        {getActionIcon(log.action)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getActionColor(log.action)} size="medium">
                          {formatAction(log.action)}
                        </Badge>
                        <span className="text-sm font-mono text-muted">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-muted">Entity</p>
                          <p className="font-medium text-text">{log.entityType} #{log.entityId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted">Actor</p>
                          <p className="font-medium text-text">{log.actorName}</p>
                          <Badge variant="accent" size="small">{log.actorRole}</Badge>
                        </div>
                      </div>
                      {log.details && (
                        <div className="bg-surface-2 rounded-lg p-3 mt-2">
                          <p className="text-sm text-muted mb-1">Details</p>
                          <p className="text-sm text-text">{log.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
