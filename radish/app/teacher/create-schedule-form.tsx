'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function CreateScheduleForm() {
  const [room, setRoom] = useState('')
  const [subject, setSubject] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  
    console.log({ room, subject, date, startTime, endTime, selectedClass })
    toast({
      title: "Schedule Created",
      description: "New schedule item has been added successfully.",
    })

    setRoom('')
    setSubject('')
    setDate('')
    setStartTime('')
    setEndTime('')
    setSelectedClass('')
  }

  const rooms = ['Room 101', 'Room 102', 'Lab 1', 'Lab 2']
  const subjects = ['Mathematics', 'Science', 'English', 'History']
  const classes = ['Class A', 'Class B', 'Class C']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="room">Choose Room</Label>
        <Select onValueChange={setRoom} value={room} required>
          <SelectTrigger id="room">
            <SelectValue placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room} value={room}>{room}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Choose Subject</Label>
        <Select onValueChange={setSubject} value={subject} required>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="class">Choose Class</Label>
        <Select onValueChange={setSelectedClass} value={selectedClass} required>
          <SelectTrigger id="class">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">Create Schedule</Button>
    </form>
  )
}

