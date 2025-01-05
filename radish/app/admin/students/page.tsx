'use client'

import { useState } from 'react'
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Student = {
  id: string;
  name: string;
  class: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudent, setNewStudent] = useState<Student>({ id: '', name: '', class: '' })
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [idError, setIdError] = useState<string>('')

  const validateStudentId = (id: string) => {
    const regex = /^S-\d{5}$/
    return regex.test(id)
  }

  const handleAddStudent = () => {
    if (newStudent.id && newStudent.name && newStudent.class) {
      if (validateStudentId(newStudent.id)) {
        setStudents([...students, newStudent])
        setNewStudent({ id: '', name: '', class: '' })
        setIdError('')
      } else {
        setIdError('Student ID must be in the format S-XXXXX (where X is a digit)')
      }
    }
  }

  const handleEditStudent = () => {
    if (editingStudent) {
      if (validateStudentId(editingStudent.id)) {
        setStudents(students.map(student => 
          student.id === editingStudent.id ? editingStudent : student
        ))
        setEditingStudent(null)
        setIdError('')
      } else {
        setIdError('Student ID must be in the format S-XXXXX (where X is a digit)')
      }
    }
  }

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Manage Students</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
            <CardDescription>Enter the details for a new student</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input 
                  id="student-id" 
                  value={newStudent.id}
                  onChange={(e) => {
                    setNewStudent({...newStudent, id: e.target.value})
                    setIdError('')
                  }}
                  placeholder="e.g., S-00001"
                />
                {idError && <p className="text-sm text-red-500">{idError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name</Label>
                <Input 
                  id="student-name" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="e.g., John Doe"
                />
              </div>
            </div>
            <Button onClick={handleAddStudent} className="mt-4">Add Student</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>ID: {student.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Class: {student.class}</p>
                <div className="mt-4 space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setEditingStudent(student)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                        <DialogDescription>Make changes to the student information here.</DialogDescription>
                      </DialogHeader>
                      {editingStudent && (
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-id">Student ID</Label>
                            <Input
                              id="edit-id"
                              value={editingStudent.id}
                              onChange={(e) => {
                                setEditingStudent({...editingStudent, id: e.target.value})
                                setIdError('')
                              }}
                            />
                            {idError && <p className="text-sm text-red-500">{idError}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editingStudent.name}
                              onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-class">Class</Label>
                            <Select onValueChange={(value) => setEditingStudent({...editingStudent, class: value})}>
                              <SelectTrigger id="edit-class">
                                <SelectValue placeholder={editingStudent.class} />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map((cls) => (
                                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleEditStudent}>Save Changes</Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDeleteStudent(student.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

