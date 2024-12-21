'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Bot } from 'lucide-react'

export default function AskAIButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bot className="mr-2 h-4 w-4" /> Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ask AI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea placeholder="Type your question here..." />
          <Button onClick={() => setIsOpen(false)}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

