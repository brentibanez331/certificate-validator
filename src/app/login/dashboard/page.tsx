import React from 'react'
import UserHeader from '../../../components/ui/UserHeader'

export default function userPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white mx-20">
        <UserHeader/>
        <main className="flex flex-col items-center justify-center flex-grow p-4">
                <div className="text-gray-500 mb-4">no events yet</div>
                <button
                    className="flex items-center px-4 py-2 bg-gray-300 rounded"
                >
                    <span className="ml-2">add your event</span>
                </button>
            </main>
    </div>
  )
}

