'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherSchedule } from "./teacher-schedule"
import { CreateScheduleForm } from "./create-schedule-form"

export default function TeacherPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

        <div className="grid gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Schedule</CardTitle>
              <CardDescription>Add a new schedule item</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateScheduleForm />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Schedule</CardTitle>
            <CardDescription>Your current teaching schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherSchedule />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

