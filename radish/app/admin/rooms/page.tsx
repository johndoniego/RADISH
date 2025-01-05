'use client'

import { useState } from 'react'
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  status: string;
}

type Room = {
  id: string;
  name: string;
  inventory: InventoryItem[];
}

const initialRooms: Room[] = [
  "CL-A", "CL-B", "CL-C", "CL-E", "CL-F", "CL-G", "L3", "L4", "CL-D", "L1", "L2"
].map(name => ({ id: name, name, inventory: [] }));

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [newInventoryItem, setNewInventoryItem] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: 0, status: 'working' })
  const { toast } = useToast()

  const handleAddInventoryItem = (roomId: string) => {
    if (newInventoryItem.name && newInventoryItem.quantity > 0) {
      const newItem: InventoryItem = { ...newInventoryItem, id: Date.now() }
      setRooms(rooms.map(room => 
        room.id === roomId 
          ? { ...room, inventory: [...room.inventory, newItem] }
          : room
      ))
      setNewInventoryItem({ name: '', quantity: 0, status: 'working' })
      toast({
        title: "Success",
        description: "Inventory item added successfully.",
      })
    }
  }

  const handleDeleteInventoryItem = (roomId: string, itemId: number) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, inventory: room.inventory.filter(item => item.id !== itemId) }
        : room
    ))
    toast({
      title: "Success",
      description: "Inventory item deleted successfully.",
    })
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 mb-8 text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Manage Rooms</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="bg-white shadow-md">
              <CardHeader className="bg-gray-100">
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>ID: {room.id}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div>
                  <h4 className="font-semibold mb-2">Inventory</h4>
                  {room.inventory.map((item) => (
                    <div key={item.id} className="flex justify-between items-center mb-2 bg-gray-50 p-2 rounded">
                      <span>{item.name} (Qty: {item.quantity})</span>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteInventoryItem(room.id, item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Item name"
                      value={newInventoryItem.name}
                      onChange={(e) => setNewInventoryItem({...newInventoryItem, name: e.target.value})}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={newInventoryItem.quantity || ''}
                      onChange={(e) => setNewInventoryItem({...newInventoryItem, quantity: parseInt(e.target.value) || 0})}
                      className="w-20"
                    />
                    <Button onClick={() => handleAddInventoryItem(room.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

