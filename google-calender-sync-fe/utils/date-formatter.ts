export const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime)
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Created":
      return "bg-green-100 text-green-800 border-green-200"
    case "Updated":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Deleted":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
