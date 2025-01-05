import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BrainCircuit } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/(auth)/auth/action'


export default async function Header() {

  const supabase = await createClient()


  const { data: { user } } = await supabase.auth.getUser()



  return (
    <header >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" >
          <div className="flex text-2xl font-bold  text-violet-100">
            <BrainCircuit width={35} height={30} className='mr-2' />
            AI Notes
          </div>
        </Link>
        {user !== null ? (
          <div className="flex items-center space-x-4">
            <Link href={'/notebook/chat'}>
              <Button variant="ghost" size="icon" className="rounded-full border-2 text-black bg-violet-100 border-white
                      hover:bg-gray-900 hover:text-white">
                AI
              </Button>
            </Link>
            <Link href="/notebook">
              <Button size={"sm"} type='submit' variant={"outline"}
                className={"bg-violet-100 text-black hover:bg-white hover:text-black mr-2"}>
                Notebook
              </Button>
            </Link>
            <form action={async () => {
              'use server'
              await logout();
            }}>

              <Button size={"sm"} type='submit' variant={"outline"}
                className={"bg-gray-900 text-white hover:bg-gray-800 hover:text-white"}>
                  Logout
              </Button>
            </form>
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

