"use client"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface notes{
    id: number,
    name: string,
    description: string
}

export default function FetchNotebook() {

    const [notes, setNotes] = useState<notes[]>([])

    const fetchNotebook = async () => {
        const response = await fetch('/api/notebook')
        const data = await response.json()
        setNotes(data)
        console.log(data)
    }

    useEffect(() => {
        fetchNotebook()
    },[])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {notes?.map((data) => (
        <Link href={`/notebook/${data?.id}`} key={data?.id}>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>{data?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">{data?.description} pages</p>
                </CardContent>
            </Card>
        </Link>
    ))}
</div>
  )
}
