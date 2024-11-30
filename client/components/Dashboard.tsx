
import React from 'react'
import { Task } from '@/types'

type DashboardProps = {
    tasks: Task[]
}

export function Dashboard({ tasks }: DashboardProps) {
    const totalTasks = tasks?.length
    const completedTasks = tasks?.filter(task => task.status === 'Finished')?.length
    const pendingTasks = totalTasks - completedTasks
    const averageTimePerTask = tasks
        ?.filter(task => task.status === 'Finished')
        ?.reduce((acc, task) => acc + (task.endTime.getTime() - task.startTime.getTime()), 0) / (completedTasks * 3600000)

    const pendingTasksSummary = tasks?.filter(task => task.status === 'Pending')
    const totalTimeLapsed = pendingTasksSummary.reduce((acc, task) => acc + (new Date().getTime() - task.startTime.getTime()), 0) / 3600000
    const totalTimeToFinish = pendingTasksSummary.reduce((acc, task) => acc + (task.endTime.getTime() - new Date().getTime()), 0) / 3600000

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">Summary</h3>
                    <ul className="space-y-2">
                        <li>Total tasks: {totalTasks}</li>
                        <li>Tasks completed: {completedTasks} ({((completedTasks / totalTasks) * 100).toFixed(0)}%)</li>
                        <li>Tasks pending: {pendingTasks} ({((pendingTasks / totalTasks) * 100).toFixed(0)}%)</li>
                        <li>Average time per completed task: {averageTimePerTask.toFixed(2)} hrs</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Pending task summary</h3>
                    <ul className="space-y-2">
                        <li>Pending tasks: {pendingTasks}</li>
                        <li>Total time lapsed: {totalTimeLapsed.toFixed(2)} hrs</li>
                        <li>Total time to finish: {totalTimeToFinish.toFixed(2)} hrs</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}


