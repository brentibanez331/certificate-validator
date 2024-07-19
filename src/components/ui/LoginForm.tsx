"use client"
import React, {useState, ChangeEvent, FormEvent} from 'react'
import axios from 'axios';

interface LoginFormProps {
    onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle}) => {
    const [loginData, setLoginData] = useState ({
        username: '',
        password: '',
    })

    return (
        <form>
            <div className="mb-4">
                <label className="block text-sm mb-1" htmlFor="username">Username</label>
                <input 
                    className="w-full px-3 py-2 border rounded"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm mb-1" htmlFor="password">Password</label>
                <input 
                    className="w-full px-3 py-2 border rounded"
                    id="password"
                    name="password"
                    type="text"
                    placeholder="Enter your password"
                />
            </div>
            <div className="mb-4 flex items-center justify-center">
                    <button className="bg-gray-400 px-4 py-2 rounded" type="submit">Log in</button>
                </div>
        </form>
    )
}

export default LoginForm;