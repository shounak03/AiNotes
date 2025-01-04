import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Settings, LogOut, BrainCircuit } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/action'


export default async function Header() {

  const supabase = await createClient()


    const { data: { user } } = await supabase.auth.getUser()



  return (
    <header >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" >
          <div className="flex text-2xl font-bold  text-violet-100">
            <BrainCircuit width={35} height={30} className='mr-2'/>
            AI Notes
          </div>
        </Link>
        {user!==null ? (
          <div className="flex items-center space-x-4">
            <Link href={'/'}>
              <Button variant="ghost" size="icon" className="rounded-full border-2 text-black bg-violet-100 border-white">
                  Ai
              </Button>
            </Link>
            <Link href="/notebook">
              <Button size={"sm"} type='submit' variant={"outline"} 
                  className={"bg-violet-100 text-black hover:bg-white hover:text-black mr-4"}>
                  Notebook
              </Button>
            </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border-2 border-gray-600">
                <img
                  src="/boy3.png"
                  alt="User profile"
                  className="rounded-full"
                  width={42}
                  height={42}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='bg-violet-100 mt-2'>
              <DropdownMenuItem>
                <span className="font-semibold">Username</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <form action={async()=>{
                    'use server'
                    await logout();
                }}>

                  <button>Log out</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        ) 
        : 
        (
          <div>
            <Link href="/auth/login">
              <Button size={"sm"} type='submit' variant={"outline"} 
                  className={"bg-primary text-primary-foreground hover:bg-white hover:text-black"}>
                  Login
              </Button>
            </Link>
          </div>
        )
        }
        
      </div>
    </header>
  )
}

