import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Notification, NotificationType } from "@/types/calendar"

interface NotificationProps {
  notification: Notification
}

export function NotificationAlert({ notification }: NotificationProps) {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <Alert
      className={`mb-6 border-l-4 ${
        notification.type === "success"
          ? "border-l-green-500 bg-green-50"
          : notification.type === "error"
            ? "border-l-red-500 bg-red-50"
            : "border-l-blue-500 bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {getNotificationIcon(notification.type)}
        <AlertDescription className="text-sm font-medium">{notification.message}</AlertDescription>
      </div>
    </Alert>
  )
}
