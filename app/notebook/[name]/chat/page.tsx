import Chat from '@/components/Chat'
import React from 'react'

type Props = {
    params: {
      name: string
    }
  }

async function  page({params}:Props) {
    const {name} = await params
  return (
    <Chat name={name}/>
  )
}

export default page