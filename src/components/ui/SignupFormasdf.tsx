'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';

interface SignupFormProps {
    onToggle: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggle }) => {
    const [step, setStep] = useState(1); // Step 1: User info, Step 2: Organization
    const [signupData, setSignupData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        organizationId: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [organizations, setOrganizations] = useState<{ id: number, organizationName: string }[]>([]);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organization`);
                console.log(response);
                setOrganizations(response.data.map((org: { id: number, organizationName: string }) => ({
                    id: org.id,
                    organizationName: org.organizationName,
                })));
            } catch (error) {
                console.error('Error fetching organizations:', error);
                setErrorMessage('Failed to fetch organizations.');
            }
        };

        fetchOrganizations();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSignupData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(signupData.password != signupData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signup`, {
                email: signupData.email,
                password: signupData.password,
                username: signupData.username,
                firstName: signupData.firstname,
                lastName: signupData.lastname,
                organizationId: parseInt(signupData.organizationId),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setSuccessMessage('Signup successful!');
                setErrorMessage('');
            } else {
                setErrorMessage('Signup failed.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response);
                setErrorMessage(error.response?.data?.message || 'Axios Error! An error occurred during signup.');
            } else {
                console.error('Error:', error);
                setErrorMessage('An error occurred during signup.');
            }
        }
    };

    return (
        <div>
            {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
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
                        <button className="bg-gray-400 px-4 py-2 rounded" type="submit">Next</button>
                    </div>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="organization">Organization*</label>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            id="organization"
                            name="organizationId"
                            value={signupData.organizationId}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select an organization</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.organizationName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="confirmPassword">Confirm Password*</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={signupData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-between mb-4">
                        <button
                            type="button"
                            className="bg-gray-400 px-4 py-2 rounded"
                            onClick={() => setStep(1)}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-400 px-4 py-2 rounded"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            )}
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
    );
};

export default SignupFormasdfasef;
