'use client'
import React, { useState } from 'react'
import SignupForm from '../../components/ui/SignupForm';
import LoginForm from '../../components/ui/LoginForm';

export default function Form() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <header className="w-full flex justify-center p-5">
        <div className="flex flex-col items-center">
          <div className="bg-gray-800 w-12 h-12 mb-2"></div>
          <span className="text-black font-bold">Certificate Validation System</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="bg-gray-200 w-full max-w-lg p-8 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold mb-4">Lorem ipsum dolor sit amet, consectetur</h1>
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded ${isSignup ? 'bg-gray-400' : 'bg-gray-200'}`}
              onClick={() => setIsSignup(true)}
            >
              Signup
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded ${isSignup ? 'bg-gray-200' : 'bg-gray-400'}`}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
          </div>
          {isSignup ? <SignupForm onToggle={() => setIsSignup(true)} /> : <LoginForm onToggle={() => setIsSignup(false)} />}
        </div>
      </main>
    </div>
  )
}
