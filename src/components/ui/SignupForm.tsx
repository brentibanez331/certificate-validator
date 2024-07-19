'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface SignupFormProps {
    onToggle: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggle }) => {
    const [signupData, setSignupData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setSignupData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submitting form with data:', signupData);
        try {
            const response = await axios.post("https://certificate-validator-db.onrender.com/signup", signupData);
            if (response.data["success"]) {
                setSuccessMessage('Signup successful!');
                console.log('Response from server:', response.data);
            } else {
                console.error('Signup failed:', response.data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex mb-4">
                    <div className="w-1/2 pr-2">
                        <label className="block text-sm mb-1" htmlFor="firstname">First Name*</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            id="firstname"
                            name="firstname"
                            type="text"
                            placeholder="Enter your first name"
                            value={signupData.firstname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-1/2 pl-2">
                        <label className="block text-sm mb-1" htmlFor="lastname">Last Name*</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            id="lastname"
                            name="lastname"
                            type="text"
                            placeholder="Enter your last name"
                            value={signupData.lastname}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1" htmlFor="username">Username*</label>
                    <input
                        className="w-full px-3 py-2 border rounded"
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        value={signupData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1" htmlFor="email">Email*</label>
                    <input
                        className="w-full px-3 py-2 border rounded"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1" htmlFor="password">Password*</label>
                    <input
                        className="w-full px-3 py-2 border rounded"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={signupData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4 flex items-center justify-center">
                    <button className="bg-gray-400 px-4 py-2 rounded" type="submit">Sign Up</button>
                </div>
            </form>
            {successMessage && (
                <div className="mt-4 text-green-500">
                    {successMessage}
                </div>
            )}
        </div>
    );
}

export default SignupForm;
