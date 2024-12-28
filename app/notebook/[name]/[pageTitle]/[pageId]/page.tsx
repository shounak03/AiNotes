
import DisplayPage from '@/components/display-page'
import React from 'react'

interface Props {
  params: {
    name: string
    pageTitle: string
    pageId: string
  }
}
async function page({params}:Props) {

  const {name, pageTitle, pageId} = await params;
  return (
    // <div>page title - {pageTitle} 
    //       pageid = {pageId}
    //       name = {name}
    // </div>
    <DisplayPage pageId={pageId } name={name}/>
  )
}

export default page