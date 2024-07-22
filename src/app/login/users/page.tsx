import React from 'react'

export default function userPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white mx-20">
        <header className="w-full flex justify-between p-5">
          <div className="flex items-center">
            <div className="bg-gray-800 w-6 h-6 mr-2"></div>
            <span className="text-black font-bold">Certificate Validation System</span>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col">
              <p className="text-black font-bold">Jane Doe</p>
              <p>janedoe@gmail.com</p>
            </div>
            <div className="bg-gray-800 w-6 h-6 ml-1 rounded-full"></div>
          </div>
            
        </header>
        <main>

        </main>
    </div>
  )
}

