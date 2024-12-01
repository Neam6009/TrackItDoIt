'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login, register } from "@/lib/utils"
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useUser } from "@/context/UserContext"
import toast from "react-hot-toast"

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const registerSchema = loginSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function AuthPage() {
    const { user,setUser } = useUser()
    const [isLogin, setIsLogin] = useState(true)
    const schema = isLogin ? loginSchema : registerSchema

    useEffect(() => {

    }, [user]);
    

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            ...(isLogin ? {} : { name: '', confirmPassword: '' }),
        },
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {

        if (isLogin) {
            const log = await login(values,setUser)
            if(log == "Logged in successfully"){
                toast.success(log)
            }else{
                toast.error(log)
            }
            form.reset()
        } else {
            const reg = await register(values)
            if(reg?.status == 201){
                toast.success("user registered successfully, pls login")
            }else if (reg?.status == 400){
                toast.error("error registering user " + reg.msg)
            }


            form.reset()
        }
    }



    return (
        <div className="flex items-center  justify-center mt-36 bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Enter your credentials to login' : 'Create a new account'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!isLogin && (
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <Button type="submit" className="w-full">
                                {isLogin ? 'Login' : 'Register'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <Button variant="link" className="w-full" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

