
import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axios from 'axios';
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"

export default function SignupForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [organizations, setOrganizations] = useState<{ id: number, organizationName: string }[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [signupData, setSignupData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        organizationId: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organization`);
                setOrganizations(response.data.map((org: { id: number, organizationName: string }) => ({
                    id: org.id,
                    organizationName: org.organizationName,
                })));
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setSelectedOrganization(value);
        setSignupData({ ...signupData, organizationId: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signup`, {
                email: signupData.email,
                password: signupData.password,
                username: signupData.email, // or another field you want to use as the username
                firstName: signupData.firstname,
                lastName: signupData.lastname,
                organizationId: parseInt(signupData.organizationId),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                toast({
                    title: "Signup successful!",
                    className: "bg-green-500 text-white"
                })
                setErrorMessage('');
                router.push('/dashboard'); 
            } else {
                setErrorMessage('Signup failed.');
                toast({
                    title: "Signup failed!",
                    description: `${response.status}: Please check all information`,
                    className: "bg-red-500 text-white"
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response);
                toast({
                    title: `${error.response?.data?.message}`,
                    className: "bg-red-500 text-white"
                })
                // setErrorMessage(error.response?.data?.message || 'Axios Error! An error occurred during signup.');
            } else {
                console.error('Error:', error);
                setErrorMessage('An error occurred during signup.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Enter your profile information to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className='grid grid-cols-2 gap-x-3'>
                        <div className='space-y-1'>
                            <Label htmlFor="firstname">First Name</Label>
                            <Input
                                id="firstname"
                                name="firstname"
                                placeholder="John"
                                value={signupData.firstname}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='space-y-1'>
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                id="lastname"
                                name="lastname"
                                placeholder="Doe"
                                value={signupData.lastname}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="****@gmail.com"
                            value={signupData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor="organizationId">Organization</Label>
                        <Select onValueChange={handleSelectChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Organization..." />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map((organization) => (
                                    <SelectItem key={organization.id} value={organization.id.toString()}>
                                        {organization.organizationName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-1 mb-5 relative'>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                placeholder=""
                                type={showPassword ? 'text' : 'password'}
                                value={signupData.password}
                                onChange={handleInputChange}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute bottom-0 right-0 flex items-center pr-3 hover:bg-transparent"
                            >
                                {showPassword ? <IoEye /> : <IoEyeOff />}
                            </Button>
                        </div>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                    <Button type="submit" className='space-y-1 w-full mt-5'>Confirm</Button>
                </CardContent>
            </Card>
        </form>
    );
}
