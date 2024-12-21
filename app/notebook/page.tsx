import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

// Mock data for notebooks
const notebooks = [
  { id: 1, title: 'Work Notes', pageCount: 5 },
  { id: 2, title: 'Personal Journal', pageCount: 10 },
  { id: 3, title: 'Project Ideas', pageCount: 3 },
]

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Notebooks</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Notebook
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notebooks.map((notebook) => (
          <Link href={`/notebook/${notebook.id}`} key={notebook.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{notebook.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{notebook.pageCount} pages</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

