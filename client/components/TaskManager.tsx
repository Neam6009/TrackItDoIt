
import React, { useState } from 'react'
import { Task, SortOption } from '@/types'
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

const initialTasks: Task[] = [
    {
        id: 'T-00001',
        title: 'Buy clothes',
        priority: 5,
        status: 'Pending',
        startTime: new Date('2024-11-26T11:00:00'),
        endTime: new Date('2024-11-30T11:00:00'),
    },
    {
        id: 'T-00002',
        title: 'Finish code',
        priority: 2,
        status: 'Finished',
        startTime: new Date('2024-11-25T09:05:00'),
        endTime: new Date('2024-11-25T15:15:00'),
    },
    {
        id: 'T-00003',
        title: 'Book travel tickets',
        priority: 4,
        status: 'Pending',
        startTime: new Date('2024-11-19T22:00:00'),
        endTime: new Date('2024-11-20T23:00:00'),
    },
    {
        id: 'T-00004',
        title: 'Order groceries',
        priority: 3,
        status: 'Finished',
        startTime: new Date('2024-10-14T10:30:00'),
        endTime: new Date('2024-10-16T22:30:00'),
    },
    {
        id: 'T-00005',
        title: 'Medical checkup',
        priority: 1,
        status: 'Pending',
        startTime: new Date('2024-11-19T13:15:00'),
        endTime: new Date('2024-12-21T17:00:00'),
    },
]

export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [sortOption, setSortOption] = useState<SortOption>('Start time: ASC')
    const [statusFilter, setStatusFilter] = useState<'Pending' | 'Finished' | null>(null)
    const [priorityFilter, setPriorityFilter] = useState<number | null>(null)
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())

    const openModal = (task?: Task) => {
        setEditingTask(task || null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingTask(null)
    }

    const handleSaveTask = (task: Task) => {
        if (editingTask) {
            setTasks(tasks.map(t => t.id === task.id ? task : t))
        } else {
            setTasks([...tasks, { ...task, id: `T-${String(tasks.length + 1).padStart(5, '0')}` }])
        }
        closeModal()
    }

    const handleDeleteSelected = () => {
        setTasks(tasks.filter(task => !selectedTasks.has(task.id)))
        setSelectedTasks(new Set())
    }

    const toggleTaskSelection = (taskId: string) => {
        const newSelectedTasks = new Set(selectedTasks)
        if (newSelectedTasks.has(taskId)) {
            newSelectedTasks.delete(taskId)
        } else {
            newSelectedTasks.add(taskId)
        }
        setSelectedTasks(newSelectedTasks)
    }

    const sortedAndFilteredTasks = tasks
        .filter(task => !statusFilter || task.status === statusFilter)
        .filter(task => !priorityFilter || task.priority === priorityFilter)
        .sort((a, b) => {
            switch (sortOption) {
                case 'Start time: ASC':
                    return a.startTime.getTime() - b.startTime.getTime()
                case 'Start time: DESC':
                    return b.startTime.getTime() - a.startTime.getTime()
                case 'End time: ASC':
                    return a.endTime.getTime() - b.endTime.getTime()
                case 'End time: DESC':
                    return b.endTime.getTime() - a.endTime.getTime()
                default:
                    return 0
            }
        })

    return (
        <div className="container mx-auto p-4">
            <Dashboard tasks={tasks} />
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Task list</h2>
                    <Button onClick={() => setIsModalOpen(true)}>+ Add task</Button>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <Button variant="destructive" onClick={handleDeleteSelected} disabled={selectedTasks.size === 0}>
                        Delete selected
                    </Button>
                    <div className="flex space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Sort: {sortOption}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setSortOption('Start time: ASC')}>Start time: ASC</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption('Start time: DESC')}>Start time: DESC</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption('End time: ASC')}>End time: ASC</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption('End time: DESC')}>End time: DESC</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Priority: {priorityFilter || 'All'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {[1, 2, 3, 4, 5].map(priority => (
                                    <DropdownMenuItem key={priority} onClick={() => setPriorityFilter(priority)}>
                                        {priority}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem onClick={() => setPriorityFilter(null)}>All</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Status: {statusFilter || 'All'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('Finished')}>Finished</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Task ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Total time to finish (hrs)</TableHead>
                            <TableHead className="text-right">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAndFilteredTasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedTasks.has(task.id)}
                                        onCheckedChange={() => toggleTaskSelection(task.id)}
                                    />
                                </TableCell>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{task.priority}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>{task.startTime.toLocaleString()}</TableCell>
                                <TableCell>{task.endTime.toLocaleString()}</TableCell>
                                <TableCell>
                                    {((task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60 * 60)).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" onClick={() => openModal(task)}>Edit</Button>
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



