
'use client'
import React, { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {  Loader2, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface Props {
  pageId: string;
  name: string;
}

interface PageData {
  data:{

    title: string;
    content: string;
    updated_at: string;
  }
}
interface Summary {
  summary: string;
}



const DisplayPage = ({ pageId, name }: Props) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [save,setSave] = useState(false)


  const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    return (
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    );
  };

  // Use this hook inside a client component that's wrapped with ThemeProvider
  const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (
      <Button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        variant="outline"
        size="icon"
        className='mr-4'
      >
        {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    );
  };
  
  
  async function getPageContent() {
    try {
      setLoading(true);
      const res = await fetch(`/api/page/pageContent?pageId=${pageId}`);
      const data = await res.json();
      setPageData(data);
      setEditedContent(data.content); 
    } catch (error) {
      console.error('Error fetching page content:', error);
    } finally {
      setLoading(false);
    }
  }
  async function getSummary() {
    try {
      setLoading(true);
      const res = await fetch(`/api/summary?id=${pageId}`);
      const data = await res.json();
      setSummary(data);
    }catch (error) {}
  }

  const handleEditClick = () => {
    setEditedContent(pageData?.data?.content || '');
    setIsEditing(true);
  };
  
  async function generateSummary() {
    setLoading(true);
      try {
        const res = await fetch(`/api/summary?id=${pageId}`, {
          method: 'PUT',
        });
        const data = await res.json();
        setSummary(data);

        console.log(data);
      } catch (error) {
          console.log(error);
          
      }finally{
        setLoading(false);
        setSave(true);
      }
      
      
  }
  const getDaysAgo = (dateString: string) => {
    const updatedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  const handleSave = async () => {
    console.log(editedContent);
    
    try {
      const res = await fetch('/api/page/pageContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          content: editedContent,
        }),
      });

      if (!res.ok) {
        toast.error('Failed to update content');
        throw new Error('Failed to update content');

      }

      
      setPageData(prev => prev ? {...prev, content: editedContent} : null);
      
      getPageContent(); 
    } catch (error) {
      console.error('Error saving content:', error);
    }finally{
      setIsEditing(false);
      toast.success('Content updated successfully');
    }
  };

  const saveSummary = async () => {
      try {
        const res = await fetch(`/api/summary`,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({pageId, summary: summary?.summary})
        })
        if(!res.ok)
          return toast.error('Failed to update summary');
        toast.success('summary updated successfully')
        setSave(false)
      } catch (error) {
        console.log(error);
        
        toast.error('Failed to update summary');
      }
    
  }
  
  useEffect(() => {
    getPageContent();
    getSummary();
  }, [pageId]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

    
    <div className=" bg-violet-100 dark:bg-gray-900 transition-colors duration-200 rounded-2xl">
      <header className="border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl">
        <div className="p-4 mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            <div className='flex justify-between items-center capitalize'>
              <div>{pageData?.data?.title || 'Loading...'}</div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button onClick={() => setShowSummary(!showSummary)} size="lg">
                  Summary
                </Button>
              </div>
            </div>
          </h1>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {pageData?.data?.updated_at && getDaysAgo(pageData?.data?.updated_at)}
          </div>
        </div>
      </header>

      <main className="p-4 mx-auto max-w-7xl">
        <div className="flex gap-4">
          <div className={`${showSummary ? 'w-1/2' : 'w-full'}`}>
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 p-2 bg-white dark:bg-gray-700 dark:text-gray-100"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none cursor-pointer min-h-[24rem]">
                  {pageData?.data?.content || 'No content available'}
                </div>
              )}
            </div>
          </div>

          {showSummary && (
            <div className="w-1/2">
              <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Summary</h2>
                  <LogOut onClick={() => setShowSummary(false)} width="20px" cursor="pointer" className="dark:text-gray-100" />
                </div>
                <div className="prose dark:prose-invert">
                  {summary?.summary || 'No summary available'}
                </div>
                <div className="space-x-3">
                  <Button onClick={generateSummary} disabled={loading} className='mt-4'>
                    {loading ? 'Generating...' : "Generate new Summary"}
                  </Button>
                  {save && (
                    <Button
                      onClick={() => {
                        startTransition(() => {
                          saveSummary()
                        })
                      }}
                      className='mt-4'
                    >
                      {isPending ? <Loader2 className='animate-spin' /> : "Save summary"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="space-x-4 mt-4">
          {!isEditing && (
            <Button size="lg" onClick={() => handleEditClick()}>
              Edit
            </Button>
          )}
          {isEditing && <Button size='lg' onClick={handleSave}>Save</Button>}
          {isEditing && <Button size='lg' onClick={() => setIsEditing(false)}>Cancel</Button>}
        </div>
      </main>
    </div>
    </ThemeProvider>
  )
}




export default DisplayPage;