'use client'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { toast } from 'sonner'

// Mock data for notebooks




    
export default function CreateNotebook() {
    const [isNewSpaceDialogOpen, setIsNewSpaceDialogOpen] = useState(false)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const response = await fetch("/api/notebook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
    
            if (!response.ok) throw new Error("Failed to create notebook");
            toast.success("Notebook created successfully");
           
        } catch (error) {
            toast.error("Failed to create notebook");
        } finally {
            setIsLoading(false);
            setIsNewSpaceDialogOpen(false);
            setName("");
            setDescription("");
        }
    }

  return (
    <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Your Notebooks</h1>
                <Button onClick={() => setIsNewSpaceDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Notebook
                </Button>
                <Dialog open={isNewSpaceDialogOpen} onOpenChange={setIsNewSpaceDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Notebook</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    placeholder="Notebook Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Textarea
                                    placeholder="Description (optional)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : "Create Notebook"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
  )
}
