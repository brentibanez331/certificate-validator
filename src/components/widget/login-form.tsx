import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import LoadingDots from "@/components/ui/loading-dots";

export default function LoginForm() {
  const { toast } = useToast()
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('organizationId', userData.organizationId.toString());
        toast({
          title: "Login successful!",
          className: "bg-green-500 text-white"
        })

        setErrorMessage('');
        router.push('/dashboard');
        setIsLoading(false)
      } else {
        setIsLoading(false);
        toast({
          title: "Login failed. Try again.",
          className: "bg-green-500 text-white"
        })
        setSuccessMessage('');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response);
        setIsLoading(false)
        // setErrorMessage(error.response?.data?.message || 'An error occurred during Login.');
        toast({
          title: "Login failed.",
          description: error.response?.data?.message,
          className: "bg-red-500 text-white"
        })
      } else {
        console.error('Error:', error);
        setErrorMessage('An error occurred during login.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back!👋</CardTitle>
          <CardDescription>It's nice seeing you again</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className='space-y-1'>
            <Label htmlFor='email'>Email</Label>
            <Input id="email" onChange={handleChange} name="email" value={loginData.email}></Input>
          </div>
          <div className='space-y-1 mb-5'>
            <Label htmlFor='password'>Password</Label>
            <Input id="password" onChange={handleChange} name="password" value={loginData.password}></Input>
          </div>
          <Button className='space-y-1 w-full mt-5'>{isLoading ? <LoadingDots /> : 'Confirm'}</Button>
        </CardContent>
      </Card>
    </form>
  )
}