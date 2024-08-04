import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


export default function LoginForm() {
    return(
        <Card>
            <CardHeader>
              <CardTitle>Welcome Back!👋</CardTitle>
              <CardDescription>It's nice seeing you again</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className='space-y-1'>
                <Label htmlFor='email'>Email</Label>
                <Input id="email"></Input>
              </div>
              <div className='space-y-1 mb-5'>
                <Label htmlFor='password'>Password</Label>
                <Input id="password" placeholder=""></Input>
              </div>
              <Button className='space-y-1 w-full mt-5'>Confirm</Button>
            </CardContent>
          </Card>
    )
}