'use client'

import { useState, useCallback, useEffect } from 'react'
import { Undo, Redo, Save, Trash, RotateCcw, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

type ScheduleItem = {
  id: number;
  day: string;
  time: string;
  subject: string;
  room: string;
  class: string;
}

export function TeacherSchedule() {
  const [scheduleHistory, setScheduleHistory] = useState<ScheduleItem[][]>([[]])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)
  const [selectedRow, setSelectedRow] = useState<ScheduleItem | null>(null)
  const [editedRow, setEditedRow] = useState<ScheduleItem | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const currentSchedule = scheduleHistory[currentHistoryIndex]

  useEffect(() => {
    fetchTeacherSchedule()
  }, [])

  const fetchTeacherSchedule = () => {
    const mockSchedule: ScheduleItem[] = [
      { id: 1, day: 'Monday', time: '09:00 - 10:30', subject: 'Mathematics', room: 'Room 101', class: 'Class 10A' },
      { id: 2, day: 'Tuesday', time: '11:00 - 12:30', subject: 'Physics', room: 'Lab 1', class: 'Class 11B' },
      { id: 3, day: 'Wednesday', time: '14:00 - 15:30', subject: 'Chemistry', room: 'Lab 2', class: 'Class 10C' },
    ]
    setScheduleHistory([mockSchedule])
    setCurrentHistoryIndex(0)
  }

  const addToHistory = useCallback((newSchedule: ScheduleItem[]) => {
    setScheduleHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), newSchedule])
    setCurrentHistoryIndex(prev => prev + 1)
  }, [currentHistoryIndex])

  const handleRowClick = (item: ScheduleItem) => {
    if (isEditing) {
      if (selectedRow && selectedRow.id === item.id) {
        setSelectedRow(null)
        setEditedRow(null)
      } else {
        setSelectedRow(item)
        setEditedRow({ ...item })
      }
    }
  }

  const handleEdit = (field: keyof ScheduleItem, value: string) => {
    if (editedRow) {
      setEditedRow({ ...editedRow, [field]: value })
    }
  }

  const handleSave = () => {
    if (editedRow) {
      const newSchedule = currentSchedule.map(item => item.id === editedRow.id ? editedRow : item)
      addToHistory(newSchedule)
      setSelectedRow(null)
      setEditedRow(null)
      toast({
        title: "Success",
        description: "Schedule updated successfully.",
      })
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (selectedRow) {
      const newSchedule = currentSchedule.filter(item => item.id !== selectedRow.id)
      addToHistory(newSchedule)
      setSelectedRow(null)
      setEditedRow(null)
      toast({
        title: "Success",
        description: "Schedule item deleted successfully.",
      })
    }
  }

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1)
      setSelectedRow(null)
      setEditedRow(null)
    }
  }

  const handleRedo = () => {
    if (currentHistoryIndex < scheduleHistory.length - 1) {
      setCurrentHistoryIndex(prev => prev + 1)
      setSelectedRow(null)
      setEditedRow(null)
    }
  }

  const handleGenerateQR = () => {
    setShowQRCode(true)
  }

  const handleReset = () => {
    fetchTeacherSchedule()
    setIsEditing(false)
    setSelectedRow(null)
    setEditedRow(null)
  }

  const scheduleToString = () => {
    return currentSchedule.map(item => 
      `${item.day} ${item.time}: ${item.subject} (${item.room}, ${item.class})`
    ).join('\n')
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 space-x-2">
        <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel Edit' : 'Edit Schedule'}</Button>
        <Button onClick={handleGenerateQR}><QrCode className="mr-2 h-4 w-4" /> Generate QR Code</Button>
      </div>
      {isEditing && (
        <div className="mb-4 space-x-2">
          <Button onClick={handleUndo}><Undo className="mr-2 h-4 w-4" /> Undo</Button>
          <Button onClick={handleRedo}><Redo className="mr-2 h-4 w-4" /> Redo</Button>
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
          <Button onClick={handleDelete} variant="destructive"><Trash className="mr-2 h-4 w-4" /> Delete</Button>
          <Button onClick={handleReset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Class</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSchedule.map((item) => (
            <TableRow 
              key={item.id} 
              className={selectedRow && selectedRow.id === item.id ? 'bg-muted' : ''}
              onClick={() => handleRowClick(item)}
            >
              <TableCell>{item.day}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.room}</TableCell>
              <TableCell>{item.class}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRow && editedRow && isEditing && (
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-semibold">Edit Schedule Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day</label>
              <Input
                id="day"
                value={editedRow.day}
                onChange={(e) => handleEdit('day', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <Input
                id="time"
                value={editedRow.time}
                onChange={(e) => handleEdit('time', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <Input
                id="subject"
                value={editedRow.subject}
                onChange={(e) => handleEdit('subject', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700">Room</label>
              <Input
                id="room"
                value={editedRow.room}
                onChange={(e) => handleEdit('room', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
              <Input
                id="class"
                value={editedRow.class}
                onChange={(e) => handleEdit('class', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}

      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to view the schedule on a mobile device.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <QRCodeSVG value={scheduleToString()} size={256} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

