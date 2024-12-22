

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Settings, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/action'


export default async function Header() {

  const supabase = await createClient()


    const { data: { user } } = await supabase.auth.getUser()
    
    console.log("user = ", user);


  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          AI Notes
        </Link>
        {user!==null ? (
          <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border-2 border-gray-600">
                <img
                  src="/zen.jpeg"
                  alt="User profile"
                  className="rounded-full"
                  width={42}
                  height={42}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

