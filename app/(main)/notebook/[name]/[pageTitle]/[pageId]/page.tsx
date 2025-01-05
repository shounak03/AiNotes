
import DisplayPage from '@/components/display-page'


export default async function Page({
  params,
}: {
  params: Promise<{  pageId:string}>
}) {

  const { pageId} =  await params;
  return (
   
    <DisplayPage pageId={pageId} />
  )
}

