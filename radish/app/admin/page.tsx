'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Users, GraduationCap, School, UserCog, Building2, BookOpen } from 'lucide-react'

export default function AdminPage() {

  const adminCards = [
    { title: 'Rooms', description: 'Manage rooms, capacity, and inventory', icon: Building2, href: '/admin/rooms' },
    { title: 'Teachers', description: 'Manage teacher profiles and subjects', icon: GraduationCap, href: '/admin/teachers' },
    { title: 'Classes', description: 'Manage class information and advisors', icon: School, href: '/admin/classes' },
    { title: 'Students', description: 'Manage student enrollments and subjects', icon: Users, href: '/admin/students' },
    { title: 'Subjects', description: 'Manage subjects and assignments', icon: BookOpen, href: '/admin/subjects' },
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <Link href={card.href}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <card.icon className="h-5 w-5" />
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600">Click to manage {card.title.toLowerCase()}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

