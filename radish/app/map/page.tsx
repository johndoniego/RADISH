'use client'

import { useRef, useEffect, useState } from 'react'
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type RoomCoordinates = {
  [key: string]: number[];
}

type RoomStatus = {
  [key: string]: "occupied" | "available" | "scheduled";
}

type ScheduleItem = {
  time: string;
  subject: string;
  teacher: string;
}

type RoomSchedules = {
  [key: string]: ScheduleItem[];
}

const roomCoordinates: RoomCoordinates = {
  "CL-A": [200, 180, 370, 280],
  "CL-B": [370, 180, 540, 280],
  "CL-C": [540, 180, 710, 280],
  "CL-E": [255, 300, 425, 400],
  "CL-F": [425, 300, 655, 350],
  "CL-G": [425, 350, 655, 400],
  "SUB OFFICE": [230, 430, 370, 530],
  "TECH OFFICE": [310, 430, 370, 490],
  "L3": [370, 430, 450, 530],
  "L4": [450, 430, 530, 530],
  "CL-D": [530, 430, 710, 530],
  "CR-M": [60, 120, 100, 180],
  "CR-F": [100, 120, 140, 180],
  "L1": [60, 180, 140, 260],
  "L2": [60, 260, 140, 340],
}

const roomStatuses: RoomStatus = {
  "CL-A": "occupied",
  "CL-B": "available",
  "CL-C": "scheduled",
  "CL-E": "occupied",
  "CL-F": "available",
  "CL-G": "occupied",
  "L3": "available",
  "L4": "occupied",
  "CL-D": "available",
  "L1": "scheduled",
  "L2": "occupied",
}

const roomSchedules: RoomSchedules = {
  "CL-A": [
    { time: "09:00 - 10:30", subject: "Mathematics", teacher: "Mr. Smith" },
    { time: "11:00 - 12:30", subject: "Physics", teacher: "Ms. Johnson" },
  ],
  "CL-B": [
    { time: "13:00 - 14:30", subject: "Chemistry", teacher: "Dr. Brown" },
  ],
  "CL-C": [],
  "CL-E": [
    { time: "10:00 - 11:30", subject: "Biology", teacher: "Mrs. Davis" },
    { time: "14:00 - 15:30", subject: "English", teacher: "Mr. Wilson" },
  ],
  "CL-F": [],
  "CL-G": [
    { time: "09:30 - 11:00", subject: "History", teacher: "Ms. Thompson" },
  ],
  "L3": [],
  "L4": [
    { time: "13:30 - 15:00", subject: "Computer Science", teacher: "Mr. Lee" },
  ],
  "CL-D": [],
  "L1": [],
  "L2": [
    { time: "11:30 - 13:00", subject: "Art", teacher: "Mrs. White" },
  ],
}

export default function MapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw rooms
    Object.entries(roomCoordinates).forEach(([roomName, coords]) => {
      const [x1, y1, x2, y2] = coords

      // Set fill color based on room status
      if (["SUB OFFICE", "TECH OFFICE", "CR-M", "CR-F"].includes(roomName)) {
        ctx.fillStyle = "#d1d5db" // darker gray for non-interactive rooms
      } else {
        switch (roomStatuses[roomName]) {
          case "occupied":
            ctx.fillStyle = "#FEE2E2" // light red for occupied rooms
            break
          case "available":
            ctx.fillStyle = "#DCFCE7" // light green for available rooms
            break
          case "scheduled":
            ctx.fillStyle = "#FEF3C7" // light yellow for rooms under scheduled
            break
          default:
            ctx.fillStyle = "#e5e7eb" // light gray for unknown status
        }
      }

      // Draw filled rectangle
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1)

      // Draw border
      ctx.strokeStyle = '#000000'
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)

      // Draw room name
      ctx.fillStyle = 'black'
      ctx.font = roomName === "TECH OFFICE" ? '10px Arial' : '12px Arial'
      
      if (roomName === "TECH OFFICE") {
        // Split "TECH OFFICE" into two lines
        ctx.fillText("TECH", x1 + 5, y1 + 20)
        ctx.fillText("OFFICE", x1 + 5, y1 + 35)
      } else {
        ctx.fillText(roomName, x1 + 5, y1 + 20)
      }
    })
  }, [])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    Object.entries(roomCoordinates).forEach(([roomName, coords]) => {
      const [x1, y1, x2, y2] = coords
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        // Exclude CRM, CRF, SUB OFFICE, and TECH OFFICE from being clickable
        if (!["CR-M", "CR-F", "SUB OFFICE", "TECH OFFICE"].includes(roomName)) {
          setSelectedRoom(roomName)
          setShowSchedule(true)
        }
      }
    })
  }

  const scheduleToString = () => {
    return Object.entries(roomSchedules).map(([room, schedule]) => 
      `${room}:\n${schedule.map(item => `${item.time} - ${item.subject} (${item.teacher})`).join('\n')}`
    ).join('\n\n')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Map</CardTitle>
              <CardDescription>View real-time room availability and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <canvas 
                  ref={canvasRef} 
                  width={800} 
                  height={600}
                  className="w-full h-auto cursor-pointer"
                  onClick={handleCanvasClick}
                />
              </div>
              <div className="mt-4 flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#DCFCE7] rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#FEE2E2] rounded"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#FEF3C7] rounded"></div>
                  <span className="text-sm">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Non-interactive Room</span>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button onClick={() => setShowQRCode(!showQRCode)}>
                  {showQRCode ? 'Hide' : 'Show'} All Schedules QR Code
                </Button>
              </div>
              {showQRCode && (
                <div className="mt-4 flex justify-center">
                  <QRCodeSVG value={scheduleToString()} size={200} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRoom} Schedule</DialogTitle>
              <DialogDescription>
                View the schedule for {selectedRoom}
              </DialogDescription>
            </DialogHeader>
            {selectedRoom && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomSchedules[selectedRoom].length > 0 ? (
                    roomSchedules[selectedRoom].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.teacher}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No schedule available for this room.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

