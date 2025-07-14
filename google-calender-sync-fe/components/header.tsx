import { Calendar } from "lucide-react"

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Calendar className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Google Calendar Sync</h1>
      </div>
      <p className="text-gray-600 text-lg">Sync and manage your Google Calendar events</p>
    </div>
  )
}
