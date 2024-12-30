
'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';

interface Props {
  pageId: string;
  name: string;
}

interface PageData {
  title: string;
  content: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean
  data: PageData[]
  error?: any
}

const DisplayPage = ({ pageId, name }: Props) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

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
  // Initialize edited content when switching to edit mode
  const handleEditClick = () => {
    setEditedContent(pageData?.data?.content || '');
    setIsEditing(true);
  };
  async function generateSummary() {
    setLoading(true);
      try {
        const res = await fetch(`/api/summary?id=${pageId}`, {
          method: 'POST',
        });
        const data = await res.json();
        setSummary(data);

        console.log(data);
      } catch (error) {
          console.log(error);
          
      }finally{
        setLoading(false);
        // setShowSummary(true);
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
    try {
      const response = await fetch('/api/page/updateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          content: editedContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      
      setPageData(prev => prev ? {...prev, content: editedContent} : null);
      setIsEditing(false);
      getPageContent(); 
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  useEffect(() => {
    getPageContent();
    getSummary();
  }, [pageId]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader2 className="w-8 h-8 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="p-4 mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900">
            <div className='flex justify-between capitalize'>

            {pageData?.data?.title || 'Loading...'}
            <Button onClick={()=>(setShowSummary(!showSummary))} size={"lg"}> Summary</Button>
            </div>
          </h1>
          <div className="mt-2 text-sm text-gray-500">
            Last updated: {pageData?.data?.updated_at && getDaysAgo(pageData?.data?.updated_at)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 mx-auto max-w-7xl">
        <div className="flex gap-4">
          {/* Content Section */}
          <div className={`${showSummary ? 'w-1/2' : 'w-full'}`}>
            <div className="border rounded-lg p-4 bg-white">
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 p-2 border rounded-md font-mono text-base"
                />
              ) : (
                <div 
                  className="prose max-w-none cursor-pointer min-h-[24rem]"
                  // onClick={handleEditClick}
                >
                  {pageData?.data?.content || 'No content available'}
                </div>
              )}
            </div>
          </div>

          {/* Summary Section */}
          {showSummary && (
            <div className="w-1/2">
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between">

                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <LogOut onClick={() =>setShowSummary(false)} width="20px" cursor="pointer"/>
                </div>
                <div className="prose">
                  {summary?.summary || 'No summary available'}
                </div>
                <Button onClick={generateSummary} className='mt-4'>{loading?<Loader2 className='animate-spin'/>:"Generate new Summary"}</Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex mt-4 justify-between">
          {!isEditing &&
            <Button size={"lg"} onClick={() => handleEditClick()}> 
             Edit
            </Button>
            }

            {isEditing && <Button size={'lg'} onClick={handleSave}>Save</Button>}
            {isEditing && <Button size={'lg'} onClick={()=>(setIsEditing(false))}>Cancel</Button>}
          </div>

      </main>
    </div>
  );
};

export default DisplayPage;