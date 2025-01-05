'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const roomNames = [
  "CL-A", "CL-B", "CL-C", "CL-E", "CL-F", "CL-G", "L3", "L4", "CL-D", "L1", "L2"
]

export default function RoomPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Rooms</h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {roomNames.map((roomName) => (
            <Card key={roomName} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {roomName}
                  <Badge variant="secondary">
                    No data
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-600">No schedule information available</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedRoom(roomName)}>
                        Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{roomName} Details</DialogTitle>
                        <DialogDescription>Schedule and Room Information</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                          <p>No schedule information available for this room.</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Room Information</h3>
                          <p>No additional information available for this room.</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

