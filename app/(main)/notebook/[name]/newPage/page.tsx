'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type Props = {
  params: {
    name: string
  }
}
export default function NewPage({ params }:{ params: Promise<{ name: string}>}) {

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  
    const p = useSearchParams()
    const notebookName = p.get('name') 
    console.log(notebookName);
    
  const getParams = async () => {

    
    const { name } = await params;
    console.log('Notebook name:', name);



    setName(name.replaceAll("%20", " "));
  }
  useEffect(() => {
    getParams()
  }, []);

  

  const saveNote = async () => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    
    try {
      setLoading(true);

      const response = await fetch('/api/page', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, content }),
      });

      const data = await response.json();

      
      if (!response.ok) {
        throw new Error(data.error || "Failed to save note");
      }

      toast.success("Note saved successfully");


      if (data?.data?.notebook_id) {
        console.log(data?.data?.notebook_id);
        const noteName = name.replaceAll(" ", "%20");
        console.log(noteName);
        
        console.log(`notebook redirect = /notebook/${noteName}-${data?.data?.notebook_id}`);
        
        router.push(`/notebook/${noteName}-${data?.data?.notebook_id}`);
      } else {
        throw new Error("No notebook ID received from server");
      }

    } catch (error: any) {
      console.log('Save note error:', error);
      toast.error(error.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
}

return (
  <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-theme(spacing.32))]">
    <Card className="w-full h-[calc(100vh-theme(spacing.48))] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-[calc(100%-theme(spacing.40))]">
        <div>
          <Input
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold"
            required
          />
        </div>
        <div className="h-[calc(100%-theme(spacing.20))] overflow-hidden">
          <Textarea
            placeholder="Enter your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full overflow-y-auto resize-none"
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveNote} className="w-full cursor-pointer"
          disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "save"}
        </Button>
      </CardFooter>
    </Card>
  </div>
)
}

