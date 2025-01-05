import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <h1 className="text-5xl font-bold mb-16 text-center">Welcome to RADISH</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full">
        {[
          {
            title: 'Admin',
            description: 'Manage teachers, students, and databases',
            href: '/admin'
          },
          {
            title: 'Teacher',
            description: 'Manage schedules and view rooms',
            href: '/teacher'
          },
          {
            title: 'Room',
            description: 'View room schedules and inventory',
            href: '/room'
          },
          {
            title: 'Map',
            description: 'View room statuses and availability',
            href: '/map'
          }
        ].map((item) => (
          <Link 
            key={item.title} 
            href={item.href}
            className="block group"
          >
            <div className="border border-zinc-200 rounded-lg p-8 h-[300px] transition-all duration-200 hover:border-zinc-300 hover:shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold">{item.title}</h2>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-zinc-600">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

