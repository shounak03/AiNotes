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
import { Input } from '@/components/ui/input'
import { Share2 } from 'lucide-react'

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Notebook</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input value="https://example.com/shared-notebook" readOnly />
          <Button onClick={() => setIsOpen(false)}>Copy Link</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

