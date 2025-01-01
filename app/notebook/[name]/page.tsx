
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EllipsisVertical, Pencil, Plus, Send, SendIcon, Settings, SquareArrowOutUpRight, Trash2 } from 'lucide-react'


import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {BeatLoader} from 'react-spinners'

interface Page {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  notebook_id: string
  user_id: string
  embedding: null | any
  summary: string
}

interface ApiResponse {
  success: boolean
  data: Page[]
  error?: any
}

type Props = {
  params: {
    name: string
  }
}

export default function NotebookPage({ params }: Props) {
  const [name, setName] = useState<string>("")
  const [notebookId, setNotebookId] = useState<string>("")
  const [pageHistory, setPageHistory] = useState<Page[]>([])
  const [error, setError] = useState<string | null>(null);
  const [loading,setLoading] = useState<boolean>(false);

  const getParams = async () => {
    const { name } = await params;
    const [before, ...afterParts] = name.split('-');
    const after = afterParts.join('-');

    setName(before.replaceAll("%20", " "));
    return after;
  }

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/page?notebookId=${notebookId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      const result: ApiResponse = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      return [];
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    getParams().then((after) => {
      setNotebookId(after);
    });
    
  }, [name]);

  useEffect(() => {
    if (notebookId) {
      fetchPages().then((data) => {
        console.log('Setting pageHistory:', data); // Debug log
        setPageHistory(data);
        setLoading(false);
      });
    }
  }, [notebookId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const deletePage = async(pageId:string) =>{

    if(!pageId) {
      toast.error('Error deleting page');
      return;
    };

      
      const response = await fetch(`/api/page?pageId=${pageId}&notebookId=${notebookId}`,{
        method: 'DELETE',
      });
      if (!response.ok) {
        toast.error('Failed to delete page');
        throw new Error('Failed to delete page');
      }
      toast.success('Page deleted successfully');
      location.reload();

    }
  
    if(loading){
      return <div className="flex justify-center items-center min-h-screen">
      <BeatLoader color="#000000" size={35} />
    </div>
    }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold capitalize">{name}</h1>
          <div className="flex items-center space-x-4">

            <Link href={`${name}/chat`}>
                <Button>
                  Ask AI
                </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Settings size={25} strokeWidth={1.75} cursor={"pointer"} />
              </DropdownMenuTrigger>
              <DropdownMenuContent >
                <DropdownMenuItem>
                  <SquareArrowOutUpRight /> <span className='font-semibold'>Share Notes</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil size={20} strokeWidth={1.75} /> <span className='font-semibold'>Edit</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Link href={`/notebook/${name}/newPage`}>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Page
            </Button>
          </Link>
        </div>

        {error && (
          <Card>
            <CardContent className="text-center py-8 text-red-500">
              <p>Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {!error && Array.isArray(pageHistory) && pageHistory.length > 0 ? (
          <div className="grid gap-4">
            {pageHistory.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className='capitalize '>{page.title}</CardTitle>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical className='cursor-pointer hover:bg-gray-100 rounded-sm' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(pageId) => deletePage(page.id)}>
                          <Trash2 size={20} strokeWidth={1.75} />
                          <span className="font-semibold">Delete page</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil size={20} strokeWidth={1.75} />
                          <span className="font-semibold">Edit page</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(page.updated_at)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div  className='boder-2 border-gray-900'>
                  <Link href={`/notebook/${name}/${page.title}/${page.id}`}>
                    <Button size="sm" className='bg-white text-black hover:bg-gray-100 '>
                      <SendIcon className="mr-2 h-4 w-4" /> View Page
                    </Button>
                  </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No pages found in this notebook.</p>
              <p className="mt-2">Click the "Add Page" button to create your first page.</p>
            </CardContent>
          </Card>
        )}
      </div>
  </div>
  )
}