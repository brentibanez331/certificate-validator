"use client"
import React, {useState, ChangeEvent, FormEvent} from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LoginFormProps {
    onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle}) => {
    const [loginData, setLoginData] = useState ({
        email: '',
        password: '',
    })
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

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
            const response = await axios.post("http://192.168.1.7:5000/api/login", loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setSuccessMessage('Login successful!');
                setErrorMessage('');
                router.push('/login/users');
            } else {
                setErrorMessage('Login failed.');
                setSuccessMessage('');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response);
                setErrorMessage(error.response?.data?.message || 'An error occurred during Login.');
            } else {
                console.error('Error:', error);
                setErrorMessage('An error occurred during login.');
            }
            setSuccessMessage('');
        }
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm mb-1" htmlFor="email">Email</label>
                <input 
                    className="w-full px-3 py-2 border rounded"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
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