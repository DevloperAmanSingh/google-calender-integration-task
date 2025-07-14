export type EventStatus = "Created" | "Updated" | "Deleted"
export type NotificationType = "success" | "error" | "info"

export interface CalendarEvent {
  id: string
  title: string
  dateTime: string
  status: EventStatus
}

export interface Notification {
  type: NotificationType
  message: string
}

export interface CalendarSyncState {
  isSignedIn: boolean
  isLoading: boolean
  events: CalendarEvent[]
  notification: Notification | null
}
