'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signup } from '../action'
import {toast} from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
  // const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await signup(formData);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("Registration successful");
        router.push("/");
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="space-y-4">
              {/* <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div> */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name='email'
                  placeholder="Enter your email"
                  // value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name='password'
                  type="password"
                  placeholder="Create a password"
                  // value={password}
                  // onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-6" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline underline-blue">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

