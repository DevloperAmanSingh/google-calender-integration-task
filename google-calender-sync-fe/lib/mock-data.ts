import type { CalendarEvent } from "@/types/calendar"

export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    dateTime: "2024-01-15T09:00:00",
    status: "Created",
  },
  {
    id: "2",
    title: "Project Review Meeting",
    dateTime: "2024-01-15T14:30:00",
    status: "Updated",
  },
  {
    id: "3",
    title: "Client Presentation",
    dateTime: "2024-01-16T10:00:00",
    status: "Created",
  },
  {
    id: "4",
    title: "Lunch with Sarah",
    dateTime: "2024-01-16T12:00:00",
    status: "Deleted",
  },
]
