
"use client"

import { useState } from 'react'
import TaskManager from '@/components/TaskManager'
import AuthPage from '@/components/login'

import { Button } from "@/components/ui/button"


export default function Home() {
    // const [currentPage, setCurrentPage] = useState<'dashboard' | 'tasks'>('dashboard') 
    const [isLoggedIn,] = useState(false);


    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
                        <nav>
            
                        </nav>
                        <Button variant="outline">Sign out</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {
                    
                        isLoggedIn ? <TaskManager /> : <AuthPage/>
                    }
                </div>
            </main>
        </div>
    )
}