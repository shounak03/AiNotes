'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type Props = {
  params: {
    name: string
  }
}
export default function NewPage({ params }: Props) {

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [isSummaryVisible, setIsSummaryVisible] = useState(false)
  const router = useRouter()
  const getParams = async () => {

    const { name } = await params;
    console.log('Notebook name:', name);



    setName(name.replaceAll("%20", " "));
  }
  useEffect(() => {
    getParams()
  }, []);

  const generateSummary = async () => {
    setSummary('This is a placeholder summary generated by AI. In a real application, this would be generated based on the content of the note.')
    setIsSummaryVisible(true)
  }

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
        body: JSON.stringify({ name, title, content, summary }),
      });

      const data = await response.json();
      // console.log(data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to save note");
      }

      toast.success("Note saved successfully");

      // Use the notebook_id directly from the response
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
  <div className="container mx-auto px-4 py-8">
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold"
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Enter your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
            required
          />
        </div>
        <Collapsible open={isSummaryVisible} onOpenChange={setIsSummaryVisible}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {isSummaryVisible ? 'Hide Summary' : 'Generate Summary'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI-Generated Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {summary ? (
                  <p>{summary}</p>
                ) : (
                  <Button onClick={generateSummary}>Generate Summary</Button>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
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

