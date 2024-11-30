"use client"

import React from 'react'
import { Task } from '@/types'


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['black', 'gray']

type DashboardProps = {
    tasks: Task[]
}

export function Dashboard({ tasks }: DashboardProps) {
    const totalTasks = tasks?.length
    const completedTasks = tasks?.filter(task => task.status === 'Finished')?.length
    const pendingTasks = totalTasks - completedTasks
    const averageTimePerTask = tasks
        ?.filter(task => task.status === 'Finished')
        ?.reduce((acc, task) => acc + (new Date(task.end).getTime() - new Date(task.start).getTime()), 0) / (completedTasks * 3600000)

    const pendingTasksSummary = tasks?.filter(task => task.status === 'Pending')
    const completion = (completedTasks / totalTasks) * 100
    const oldestStartTime = pendingTasksSummary.reduce((oldest, task) => {
        const taskStartTime = new Date(task.start).getTime();
        return Math.min(oldest, taskStartTime);
    }, Infinity);
    
    const totalTimeLapsed = oldestStartTime !== Infinity
        ? (new Date().getTime() - oldestStartTime) / 3600000
        : 0; 
    
    
    
    const totalTimeToFinish = pendingTasksSummary.reduce((acc, task) => acc + (new Date(task.end).getTime() - new Date().getTime()), 0) / 3600000

    const taskCompletionData = [
        { name: 'Finished', value: completedTasks },
        { name: 'Pending', value: pendingTasks },
    ]

    const timeData = [
        { name: 'Time Lapsed', hours: totalTimeLapsed },
        { name: 'Time to Finish', hours: totalTimeToFinish },
    ]
    const dashboardComponent = totalTasks == 0 ? <h1>Please add a task to view the Dashboard! </h1> : <>
    <div className="p-0 space-y-6 max-w-7xl mx-auto bg-gray-100 mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>

            <div className="grid gap-6  md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Task Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold">Total Tasks</h3>
                                <p className="text-4xl font-bold">{totalTasks}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Avg. Time per Task</h3>
                                <p className="text-4xl font-bold">{averageTimePerTask.toFixed(0)} hrs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Task Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={taskCompletionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="gray"
                                    paddingAngle={1}
                                    dataKey="value"
                                >
                                    {taskCompletionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex justify-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-black rounded-full mr-1"></div>
                                <span className="text-sm">{completion.toFixed(2)} % Finished</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gray border border-black rounded-full mr-1"></div>
                                <span className="text-sm">{(100 - completion).toFixed(2)}% Pending</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{pendingTasks}</div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Total Time Lapsed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{totalTimeLapsed.toFixed(0)} hrs</div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Total Time to Finish</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{totalTimeToFinish.toFixed(0)} hrs</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={timeData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="hours" fill="#000000" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </>

    return (
        dashboardComponent
        
    )
}


