import React from 'react';
import Link from 'next/link';


const linkStyle = {
  margin: '0 20px',
  fontSize: '18px',
  textDecoration: 'none',  
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white mx-20">
      <header className="w-full flex justify-between p-5">
        <div className="flex items-center">
          <div className="bg-gray-800 w-6 h-6 mr-2"></div>
          <span className="text-black font-bold">Certificate Validation System</span>
        </div>
        <div>
          <Link href="/login" className="mr-4 text-black">Log In</Link>
          <Link href="/signup" className="bg-gray-200 px-4 py-1  rounded mr-4 text-black">Sign Up</Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-between px-5">
        <div className="text-left md:w-1/2">
          <h1 className="text-5xl  mb-4 ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor incididunt ut labore et dolore magna aliquyam erat.
          </h1>
          <div className="flex mt-6">
            <button className="bg-gray-200 px-4 py-2 rounded mr-2">Try for Free</button>
            <button className="border border-black px-4 py-2 rounded">See How It works</button>
          </div>
        </div>
        <div className="bg-gray-200 w-96 h-96 ml-8 px-5"></div>
      </main>
    </div>
  );
}
