'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Share2 } from 'lucide-react'
import AskAIButton from '@/components/AskAIButton'
import ShareButton from '@/components/ShareButton'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'



type Props = {
  params: {
      name:string
  }
}
const notebook = {
  id: 1,
  title: 'Work Notes',
  isPublic: false,
  pages: [
    { id: 1, title: 'Meeting Notes', content: 'Content for meeting notes...' },
    { id: 2, title: 'Project Plan', content: 'Content for project plan...' },
  ],
}



export default function getServerSideProps({params}:Props,) {

  const [name, setName] = useState<string>("");
  const [notebookId, setnotebookId] = useState<string>("");
  const [isPublic, setIsPublic] = useState(notebook.isPublic)
  

  const getParams = async() => {

    const {name} =  await params;
    
    const [before, ...afterParts] = name.split('-');
    const after = afterParts.join('-');
    setnotebookId(after);
    setName(before.replaceAll("%20"," "));


  }
  const fetchPages = async () => {
    const response = await fetch(`/api/page?${notebookId}`)
    const data = await response.json()
    console.log(data);
    
  }

  useEffect(() => {
    getParams()
  },[]);
  
  useEffect(() => {
    fetchPages();
  },[]);
  
  

  const handleTogglePublic = () => {
    setIsPublic(!isPublic)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center space-x-4">
          <AskAIButton />
          <Button variant="outline" onClick={handleTogglePublic}>
            {isPublic ? 'Make Private' : 'Make Public'}
          </Button>
          {isPublic && <ShareButton />}
        </div>
      </div>

        <div className="flex justify-between items-center mb-4">
          
          
          <Link href={`/notebook/${name}/newPage`}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Page
            </Button>
          </Link>
        </div>
    </div>
  )
}

