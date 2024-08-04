'use client'
import React, { useState, useEffect } from 'react'
import LoginForm from '@/components/widget/login-form'
import SignupForm from '@/components/widget/signup-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import SignupFormasdfasef from '@/components/ui/SignupFormasdf'


export default function Form() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('')
  const [hasSignedUp, setHasSignedUp] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const formType = query.get('type')
    if (formType) {
      setSelectedTab(formType)
    }
  }, [])

  const handleFormSwitch = (value: string) => {
    setSelectedTab(value)
    router.push(`/auth?type=${value}`)
  }

  return (
    <div className='min-h-screen items-center flex flex-col'>
      <div>
        <h1 className='text-3xl my-12'>LOGO HERE</h1>
      </div>
      <Tabs value={selectedTab} onValueChange={handleFormSwitch} className="w-[400px]">
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <SignupForm></SignupForm>
          {/* <SignupFormasdfasef></SignupFormasdfasef> */}
        </TabsContent>
        <TabsContent value="login">
          <LoginForm></LoginForm>
        </TabsContent>
      </Tabs>
    </div>
  )
}
