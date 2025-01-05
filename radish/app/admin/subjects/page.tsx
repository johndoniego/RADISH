'use client'

import { useState } from 'react'
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Subject = {
  id: string;
  name: string;
  description: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubject, setNewSubject] = useState<Subject>({ id: '', name: '', description: '' })
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [idError, setIdError] = useState<string>('')

  const validateSubjectId = (id: string) => {
    const regex = /^SUB-\d{3}$/
    return regex.test(id)
  }

  const handleAddSubject = () => {
    if (newSubject.id && newSubject.name) {
      if (validateSubjectId(newSubject.id)) {
        setSubjects([...subjects, newSubject])
        setNewSubject({ id: '', name: '', description: '' })
        setIdError('')
      } else {
        setIdError('Subject ID must be in the format SUB-XXX (where X is a digit)')
      }
    }
  }

  const handleEditSubject = () => {
    if (editingSubject) {
      if (validateSubjectId(editingSubject.id)) {
        setSubjects(subjects.map(subject => 
          subject.id === editingSubject.id ? editingSubject : subject
        ))
        setEditingSubject(null)
        setIdError('')
      } else {
        setIdError('Subject ID must be in the format SUB-XXX (where X is a digit)')
      }
    }
  }

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Manage Subjects</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Subject</CardTitle>
            <CardDescription>Enter the details for a new subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject-id">Subject ID</Label>
                <Input 
                  id="subject-id" 
                  value={newSubject.id}
                  onChange={(e) => {
                    setNewSubject({...newSubject, id: e.target.value})
                    setIdError('')
                  }}
                  placeholder="e.g., SUB-001"
                />
                {idError && <p className="text-sm text-red-500">{idError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input 
                  id="subject-name" 
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                  placeholder="Enter subject description"
                />
              </div>
            </div>
            <Button onClick={handleAddSubject} className="mt-4">Add Subject</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>ID: {subject.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{subject.description}</p>
                <div className="mt-4 space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setEditingSubject(subject)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Subject</DialogTitle>
                        <DialogDescription>Make changes to the subject information here.</DialogDescription>
                      </DialogHeader>
                      {editingSubject && (
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-id">Subject ID</Label>
                            <Input
                              id="edit-id"
                              value={editingSubject.id}
                              onChange={(e) => {
                                setEditingSubject({...editingSubject, id: e.target.value})
                                setIdError('')
                              }}
                            />
                            {idError && <p className="text-sm text-red-500">{idError}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editingSubject.name}
                              onChange={(e) => setEditingSubject({...editingSubject, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                              id="edit-description"
                              value={editingSubject.description}
                              onChange={(e) => setEditingSubject({...editingSubject, description: e.target.value})}
                            />
                          </div>
                          <Button onClick={handleEditSubject}>Save Changes</Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDeleteSubject(subject.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

