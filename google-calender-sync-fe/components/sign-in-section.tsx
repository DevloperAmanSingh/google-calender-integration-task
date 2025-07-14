"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, User } from "lucide-react"

interface SignInSectionProps {
  onSignIn: () => void
  isLoading: boolean
}

export function SignInSection({ onSignIn, isLoading }: SignInSectionProps) {
  return (
    <Card className="mb-8 shadow-sm border-0 bg-white">
      <CardContent className="flex flex-col items-center py-12">
        <div className="bg-blue-50 p-4 rounded-full mb-6">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Google Account</h2>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Sign in with your Google account to sync and manage your calendar events
        </p>
        <Button
          onClick={onSignIn}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              {/* Google Icon placeholder - in real app, use actual Google icon */}
              <div className="mr-2 h-4 w-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">G</span>
              </div>
              Sign in with Google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
