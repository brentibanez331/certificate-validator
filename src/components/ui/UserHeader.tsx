"use client"
import React, { useEffect, useState } from 'react';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    organizationId: number;
}

const Header: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <header className="w-full flex justify-between items-center p-5">
            <div className="hidden md:flex items-center space-x-4">
                    <img src="/storage/ICON_COLORED.png" className="size-10 object-contain"></img>
                    <img src="/storage/WORDMARK.png" className="h-4 object-contain"></img>
                </div>
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <div className="text-right">
                            <div className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </header>
    );
};

export default Header;
