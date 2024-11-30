
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from '@/types'

type TaskFormProps = {
    onAddTask: (task: Task) => void
}

export function TaskForm({ onAddTask }: TaskFormProps) {
    const [title, setTitle] = useState('')
    const [priority, setPriority] = useState<Task['priority']>(3)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const now = new Date()
        const newTask: Task = {
            title,
            startTime: now,
            endTime: new Date(now.getTime() + 60 * 60 * 1000), // Default to 1 hour from now
            priority,
            status: 'Pending'
        }
        onAddTask(newTask)
        setTitle('')
        setPriority(3)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority.toString()} onValueChange={(value) => setPriority(parseInt(value) as Task['priority'])}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5].map((p) => (
                            <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">Add Task</Button>
        </form>
    )
}


