
import React from 'react'

import { login } from './actions'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
 } from '@/components/ui/card'

export default function LoginPage() {

  return (
    <div className='h-screen flex justify-center items-center'>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log in to the Big Toy Maker</CardTitle>
        <CardDescription>
          Sign in to see all the stuff
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={login} >
          <div className="flex flex-col gap-6">

            {/* <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                placeholder="test"
                 />
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password"
                name="password"
                required />
            </div>
            <div>
              <Button type="submit" className="w-full" formAction={login}>
                Login
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

// export default LoginPage
