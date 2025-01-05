'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { login } from '../action'
import {toast} from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()


    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const { errorMessage } = await login(formData);
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.success("Successfully logged in");
                router.push("/");
            }
        });
    };
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name='email'
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name='password'
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-6" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary hover:underline underline-blue">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
