"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

interface SyncControlsProps {
  onSync: () => void
  isLoading: boolean
}

export function SyncControls({ onSync, isLoading }: SyncControlsProps) {
  return (
    <Card className="mb-8 shadow-sm border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-gray-900">Calendar Events</CardTitle>
            <p className="text-gray-600 text-sm mt-1">Manage your synced Google Calendar events</p>
          </div>
          <Button
            onClick={onSync}
            disabled={isLoading}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
