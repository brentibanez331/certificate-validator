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
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/login", loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data["success"]) {
                setSuccessMessage('Login successful!');
                setErrorMessage('');
            } else {
                setErrorMessage('Login failed.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response);
                setErrorMessage(error.response?.data?.message || 'An error occurred during Login.');
            } else {
                console.error('Error:', error);
                setErrorMessage('An error occurred during login.');
            }
        }
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm mb-1" htmlFor="username">Username</label>
                <input 
                    className="w-full px-3 py-2 border rounded"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm mb-1" htmlFor="password">Password</label>
                <input 
                    className="w-full px-3 py-2 border rounded"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4 flex items-center justify-center">
                    <button className="bg-gray-400 px-4 py-2 rounded" type="submit">Log in</button>
                </div>
        </form>
        {successMessage && (
            <div className="mt-4 text-green-500">
                {successMessage}
            </div>
        )}
        {errorMessage && (
            <div className="mt-4 text-red-500">
                {errorMessage}
            </div>
        )}
        </div>
    )
}

export default LoginForm;