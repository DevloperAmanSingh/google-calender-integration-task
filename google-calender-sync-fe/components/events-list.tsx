import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, RefreshCw } from "lucide-react"
import type { CalendarEvent } from "@/types/calendar"
import { formatDateTime, getStatusColor } from "@/utils/date-formatter"

interface EventsListProps {
  events: CalendarEvent[]
  isLoading: boolean
}

export function EventsList({ events, isLoading }: EventsListProps) {
  return (
    <Card className="shadow-sm border-0 bg-white">
      <CardContent className="p-0">
        {isLoading && events.length === 0 ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading calendar events...</p>
          </div>
        ) : events.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 text-center max-w-md">
              No calendar events to display. Click "Sync Now" to fetch your latest events from Google Calendar.
            </p>
          </div>
        ) : (
          // Events List
          <div className="divide-y divide-gray-100">
            {events.map((event) => {
              const { date, time } = formatDateTime(event.dateTime)
              return (
                <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {date} at {time}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getStatusColor(event.status)} font-medium`}>
                      {event.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
