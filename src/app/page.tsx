import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/toaster"

const linkStyle = {
  margin: '0 20px',
  fontSize: '18px',
  textDecoration: 'none',
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white mx-20">
      <header className="w-full flex justify-between p-5">
        <div className="hidden md:flex items-center space-x-4">
          <img src="/storage/ICON_COLORED.png" className="size-10 object-contain"></img>
          <img src="/storage/WORDMARK.png" className="h-4 object-contain"></img>
        </div>
        <div>
          <Button asChild variant="ghost" className='mr-4'><Link href="auth?type=signup">Sign up</Link></Button>
          <Button asChild><Link href="auth?type=login">Login</Link></Button>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-between px-5">
        <div className="text-left md:w-1/2">
          <h1 className="text-5xl mb-4">
            Securely verify the authenticity of your certificates.
          </h1>
          <h1>Protecting the integrity of your credentials.</h1>
          <div className="flex mt-6">
            <Button variant='outline' className='hover:bg-neutral-950 hover:text-white px-10 py-6 text-lg border border-neutral-950'>Get Started</Button>
          </div>
        </div>
        {/* <div className="bg-gray-200 w-96 h-96 ml-8 px-5"></div> */}
        <img src="/storage/openopengroup.svg" className='w-[300px] mr-48'></img>

      </div>
    </main>
  );
}
