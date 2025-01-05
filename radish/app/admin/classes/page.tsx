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

type Class = {
  id: string;
  name: string;
  advisor: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [newClass, setNewClass] = useState<Class>({ id: '', name: '', advisor: '' })
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [idError, setIdError] = useState<string>('')

  const validateClassId = (id: string) => {
    const regex = /^C-\d{3}$/
    return regex.test(id)
  }

  const handleAddClass = () => {
    if (newClass.id && newClass.name && newClass.advisor) {
      if (validateClassId(newClass.id)) {
        setClasses([...classes, newClass])
        setNewClass({ id: '', name: '', advisor: '' })
        setIdError('')
      } else {
        setIdError('Class ID must be in the format C-XXX (where X is a digit)')
      }
    }
  }

  const handleEditClass = () => {
    if (editingClass) {
      if (validateClassId(editingClass.id)) {
        setClasses(classes.map(cls => 
          cls.id === editingClass.id ? editingClass : cls
        ))
        setEditingClass(null)
        setIdError('')
      } else {
        setIdError('Class ID must be in the format C-XXX (where X is a digit)')
      }
    }
  }

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(cls => cls.id !== id))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Manage Classes</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Class</CardTitle>
            <CardDescription>Enter the details for a new class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class-id">Class ID</Label>
                <Input 
                  id="class-id" 
                  value={newClass.id}
                  onChange={(e) => {
                    setNewClass({...newClass, id: e.target.value})
                    setIdError('')
                  }}
                  placeholder="e.g., C-001"
                />
                {idError && <p className="text-sm text-red-500">{idError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Name</Label>
                <Input 
                  id="class-name" 
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  placeholder="e.g., Class 10A"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="advisor">Advisor</Label>
                <Input 
                  id="advisor" 
                  value={newClass.advisor}
                  onChange={(e) => setNewClass({...newClass, advisor: e.target.value})}
                  placeholder="e.g., Mr. Smith"
                />
              </div>
            </div>
            <Button onClick={handleAddClass} className="mt-4">Add Class</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
                <CardDescription>ID: {cls.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Advisor: {cls.advisor}</p>
                <div className="mt-4 space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setEditingClass(cls)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Class</DialogTitle>
                        <DialogDescription>Make changes to the class information here.</DialogDescription>
                      </DialogHeader>
                      {editingClass && (
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-id">Class ID</Label>
                            <Input
                              id="edit-id"
                              value={editingClass.id}
                              onChange={(e) => {
                                setEditingClass({...editingClass, id: e.target.value})
                                setIdError('')
                              }}
                            />
                            {idError && <p className="text-sm text-red-500">{idError}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editingClass.name}
                              onChange={(e) => setEditingClass({...editingClass, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-advisor">Advisor</Label>
                            <Input
                              id="edit-advisor"
                              value={editingClass.advisor}
                              onChange={(e) => setEditingClass({...editingClass, advisor: e.target.value})}
                              placeholder="e.g., Mr. Smith"
                            />
                          </div>
                          <Button onClick={handleEditClass}>Save Changes</Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDeleteClass(cls.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

