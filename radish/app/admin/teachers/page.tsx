'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Teacher = {
  id: string;
  name: string;
  password: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = React.useState<Teacher[]>([])
  const [newTeacher, setNewTeacher] = React.useState<Teacher>({ id: '', name: '', password: '' })
  const [editingTeacher, setEditingTeacher] = React.useState<Teacher | null>(null)
  const [idError, setIdError] = React.useState<string>('')
  const { toast } = useToast()

  const validateTeacherId = (id: string) => {
    const regex = /^\d{2}-\d{5}$/
    return regex.test(id)
  }

  const handleAddTeacher = () => {
    if (newTeacher.id && newTeacher.name && newTeacher.password) {
      if (validateTeacherId(newTeacher.id)) {
        setTeachers([...teachers, newTeacher])
        setNewTeacher({ id: '', name: '', password: '' })
        setIdError('')
      } else {
        setIdError('Teacher ID must be in the format xx-xxxxx (only digits)')
      }
    }
  }

  const handleEditTeacher = () => {
    if (editingTeacher) {
      if (validateTeacherId(editingTeacher.id)) {
        setTeachers(teachers.map(teacher => 
          teacher.id === editingTeacher.id ? editingTeacher : teacher
        ))
        setEditingTeacher(null)
        setIdError('')
        toast({
          title: "Teacher Updated",
          description: "The teacher's information has been successfully updated.",
          duration: 3000,
        })
      } else {
        setIdError('Teacher ID must be in the format xx-xxxxx (only digits)')
      }
    }
  }

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Manage Teachers</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Teacher</CardTitle>
            <CardDescription>Enter the details for a new teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-id">Teacher ID</Label>
                <Input 
                  id="teacher-id" 
                  value={newTeacher.id}
                  onChange={(e) => {
                    setNewTeacher({...newTeacher, id: e.target.value})
                    setIdError('')
                  }}
                  placeholder="e.g., 12-34567"
                />
                {idError && <p className="text-sm text-red-500">{idError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-name">Teacher Name</Label>
                <Input 
                  id="teacher-name" 
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-password">Password</Label>
                <Input 
                  id="teacher-password" 
                  type="password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
            </div>
            <Button onClick={handleAddTeacher} className="mt-4">Add Teacher</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardHeader>
                <CardTitle>{teacher.name}</CardTitle>
                <CardDescription>ID: {teacher.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setEditingTeacher({...teacher})}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Teacher</DialogTitle>
                      <DialogDescription>Make changes to the teacher's information here.</DialogDescription>
                    </DialogHeader>
                    {editingTeacher && (
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-id">Teacher ID</Label>
                          <Input
                            id="edit-id"
                            value={editingTeacher.id}
                            onChange={(e) => {
                              setEditingTeacher({...editingTeacher, id: e.target.value})
                              setIdError('')
                            }}
                          />
                          {idError && <p className="text-sm text-red-500">{idError}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Name</Label>
                          <Input
                            id="edit-name"
                            value={editingTeacher.name}
                            onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-password">Password</Label>
                          <Input
                            id="edit-password"
                            type="password"
                            value={editingTeacher.password}
                            onChange={(e) => setEditingTeacher({...editingTeacher, password: e.target.value})}
                            placeholder="Enter new password (leave blank to keep current)"
                          />
                        </div>
                        <Button onClick={handleEditTeacher}>Save Changes</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => handleDeleteTeacher(teacher.id)} className="ml-2">Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

