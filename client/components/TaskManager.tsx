import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskModal } from '@/components/TaskModal'
import { Dashboard } from '@/components/Dashboard'
import { createTask, deleteTask, editTask, getUserTasks } from '@/lib/utils'
import useSWR from 'swr'
import { Task } from '@/types'
import toast from 'react-hot-toast'

export default function TaskManager() {
    const { data: rawTasks, error, isLoading, mutate } = useSWR<Task[]>('/api/data', getUserTasks)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [sortOption, setSortOption] = useState<string>('Start time: ASC')
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [priorityFilter, setPriorityFilter] = useState<number | null>(null)
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
    const now = new Date();
    


    const tasks = rawTasks?.map(task => ({
        ...task,
    
        startTime: task.start ? new Date(task.start) : null,
        endTime: task.end ? new Date(task.end) : null
    }))

    const openModal = (task?: Task) => {
        setEditingTask(task || null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingTask(null)
    }

    const handleSaveTask = async (task: Task) => {
        try {
            if (editingTask) {
                const res = await editTask(task);
                console.log(res)
                if(res == 200){
                    toast.success("Task updated!")
                }else if(res == 401){
                    toast.error("Unauthorized")
                }else if(res == 400){
                    toast.error("error updating task")
                }

            } else {
                const res = await createTask(task)
                if(res == 201){
                    toast.success("Task added!")
                }else if (res == 400){
                    toast.error("error creating task")
                }
            }
            await mutate()
            closeModal()
        } catch (error) {
            console.error('Error saving task:', error)
        }
    }

    const handleDeleteSelected = async () => {

        try {
            const deleteList = Array.from(selectedTasks)
            const res = await deleteTask(deleteList)
            if(res == 200){
                toast.success("Tasks deleted Successfully!")
            }else if(res == 404){
                toast.error("No tasks found to delete")
            }else if(res == 400){
                toast.error("invalid deletion")
            }
            await mutate()
            
        } catch (error) {
            console.error("error deleting task",error)
        }

       
    }

    const toggleTaskSelection = (taskId: string) => {
        setSelectedTasks(prev => {
            const newSet = new Set(prev)
            if (newSet.has(taskId)) {
                newSet.delete(taskId)
            } else {
                newSet.add(taskId)
            }
            return newSet
        })
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading tasks. Please try again later.
                </div>
            </div>
        )
    }

    const sortedAndFilteredTasks = tasks ? tasks
        .filter(task => !statusFilter || task.status === statusFilter)
        .filter(task => !priorityFilter || task.priority === priorityFilter)
        .sort((a, b) => {
            const aStart = a.startTime?.getTime() ?? 0
            const bStart = b.startTime?.getTime() ?? 0
            const aEnd = a.endTime?.getTime() ?? 0
            const bEnd = b.endTime?.getTime() ?? 0

            switch (sortOption) {
                case 'Start time: ASC':
                    return aStart - bStart
                case 'Start time: DESC':
                    return bStart - aStart
                case 'End time: ASC':
                    return aEnd - bEnd
                case 'End time: DESC':
                    return bEnd - aEnd
                default:
                    return 0
            }
        }) : []

    return (
        <div className="container mx-auto p-4">
            <Dashboard tasks={tasks || []} />
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Task list</h2>
                    <Button onClick={() => setIsModalOpen(true)}>+ Add task</Button>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <Button 
                        variant="destructive" 
                        onClick={handleDeleteSelected} 
                        disabled={selectedTasks.size === 0}
                    >
                        Delete selected
                    </Button>
                    <div className="flex space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Sort: {sortOption}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setSortOption('Start time: ASC')}>
                                    Start time: ASC
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption('Start time: DESC')}>
                                    Start time: DESC
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption('End time: ASC')}>
                                    End time: ASC
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption('End time: DESC')}>
                                    End time: DESC
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Priority: {priorityFilter || 'All'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {[1, 2, 3, 4, 5].map(priority => (
                                    <DropdownMenuItem 
                                        key={priority} 
                                        onClick={() => setPriorityFilter(priority)}
                                    >
                                        {priority}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                                    All
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Status: {statusFilter || 'All'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>
                                    Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('Finished')}>
                                    Finished
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                                    All
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Task ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Total time to finish (hrs)</TableHead>
                            <TableHead>Time elapsed (hrs)</TableHead>
                            <TableHead className="text-right">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAndFilteredTasks.map((task) => (
                            <TableRow key={task._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedTasks.has(task._id)}
                                        onCheckedChange={() => toggleTaskSelection(task._id)}
                                    />
                                </TableCell>
                                <TableCell>{task._id}</TableCell>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{task.priority}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>
                                    {task.startTime?.toLocaleString() || 'Not set'}
                                </TableCell>
                                <TableCell>
                                    {task.endTime?.toLocaleString() || 'Not set'}
                                </TableCell>
                                <TableCell>
                                    {task.startTime && task.endTime
                                        ? ((task.endTime.getTime() - task.startTime.getTime()) / 
                                        (1000 * 60 * 60)).toFixed(0)
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {task.startTime && task.endTime
                                        ? ((now.getTime() - task.startTime.getTime()) / 
                                        (1000 * 60 * 60)).toFixed(0)
                                        : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => openModal(task)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <TaskModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveTask}
                task={editingTask}
    
            />
        </div>
    )
}