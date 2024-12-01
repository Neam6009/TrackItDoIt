
"use client"

import { useEffect, useState } from 'react'
import TaskManager from '@/components/TaskManager'
import AuthPage from '@/components/login'

import { Button } from "@/components/ui/button"
import { useUser } from '@/context/UserContext'
import { jwtDecode } from "jwt-decode";
import { logout } from '@/lib/utils'
import { UserData } from '@/types'



export default function Home() {
    const { user, setUser } = useUser();
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'tasks'>('dashboard')


    const handleCookie = async () => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/getToken", {
                "credentials": 'include'
            });
            const data = await res.json()
            const token = data.token;

            if (token) {
                const decoded : UserData = jwtDecode(token);
                setUser(decoded);
            }

        } catch (error) {
            console.log("failed to fetch token" + error)
        }
    }

    const handleLogout = async () => {
        try {
            const status = await logout();
            if (status == 200) {
                setIsLoggedIn(false);
                setUser(null)
            }
        } catch (error) {
            console.log("logout error ",error)
        }
    }


    const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false);

    useEffect(() => {
        handleCookie()
    }, )

    useEffect(() => {
        setIsLoggedIn(user ? true : false)
    }, [user])




    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Track it Do it</h1>
                        <nav>
                            <Button
                                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                                onClick={() => setCurrentPage('dashboard')}
                                className="mr-4"
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant={currentPage === 'tasks' ? 'default' : 'ghost'}
                                onClick={() => setCurrentPage('tasks')}
                            >
                                Task list
                            </Button>

                        </nav>
                        {

                            isLoggedIn ? <Button variant="outline" onClick={handleLogout}>Sign out</Button> : ""
                        }

                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {
                        isLoggedIn ? <TaskManager currPage = {currentPage} /> : <AuthPage />
                    }
                </div>
            </main>
        </div>
    )
}