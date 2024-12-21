'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Share2 } from 'lucide-react'
import AskAIButton from '@/components/AskAIButton'
import ShareButton from '@/components/ShareButton'

// Mock data for a notebook
const notebook = {
  id: 1,
  title: 'Work Notes',
  isPublic: false,
  pages: [
    { id: 1, title: 'Meeting Notes', content: 'Content for meeting notes...' },
    { id: 2, title: 'Project Plan', content: 'Content for project plan...' },
  ],
}

export default function NotebookPage({ params }: { params: { id: string } }) {
  const [isPublic, setIsPublic] = useState(notebook.isPublic)

  const handleTogglePublic = () => {
    setIsPublic(!isPublic)
    // Here you would typically update the server with the new public status
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{notebook.title}</h1>
        <div className="flex items-center space-x-4">
          <AskAIButton />
          <Button variant="outline" onClick={handleTogglePublic}>
            {isPublic ? 'Make Private' : 'Make Public'}
          </Button>
          {isPublic && <ShareButton />}
        </div>
      </div>
      <Tabs defaultValue={notebook.pages[0].id.toString()}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {notebook.pages.map((page) => (
              <TabsTrigger key={page.id} value={page.id.toString()}>
                {page.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Page
          </Button>
        </div>
        {notebook.pages.map((page) => (
          <TabsContent key={page.id} value={page.id.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>{page.title}</CardTitle>
                {isPublic && <ShareButton />}
              </CardHeader>
              <CardContent>
                <p>{page.content}</p>
                {/* Here you would typically have a rich text editor for the content */}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

