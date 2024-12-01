
import React, { useState, useEffect } from 'react'
import { Task } from '@/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'react-hot-toast';

type TaskModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave: (task: Task) => void
    task?: Task | null
}

const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
    const [title, setTitle] = useState('')
    const [priority, setPriority] = useState<Task['priority']>(3)
    const [status, setStatus] = useState<Task['status']>('Pending')
    const [start, setstart] = useState('')
    const [end, setend] = useState('')
    

    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setPriority(task.priority)
            setStatus(task.status)
            setstart(formatDateForInput(new Date(task.start || "")))
            setend(formatDateForInput(new Date(task.end || "")))
        } else {
            setTitle('')
            setPriority(3)
            setStatus('Pending')
            setstart('')
            setend('')
        }

    }, [task])

    const handleSave = () => {

        if(title == '' || !priority || !status || start == '' || end == ''){
            toast.error("please enter all task details")
        }else{
            if(task){
                onSave({
                    _id: task._id,
                    title,
                    priority,
                    status,
                    start: new Date(start),
                    end: status == "Finished" ? new Date() : new Date(end),
                })
            }else{
                onSave({
                    title,
                    priority,
                    status,
                    start: new Date(start),
                    end: new Date(end),
                })
            }

        }
    }

    return (    
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{task ? 'Edit task' : 'Add new task'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                            Priority
                        </Label>
                        <Select
                            value={priority.toString()}
                            onValueChange={(value) => setPriority(parseInt(value) as Task['priority'])}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5].map((p) => (
                                    <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select
                            value={status}
                            onValueChange={(value) => setStatus(value as Task['status'])}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Finished">Finished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start" className="text-right">
                            Start time
                        </Label>
                        <Input
                            id="start"
                            type="datetime-local"
                            value={start}
                            onChange={(e) => setstart(e.target.value)}
                            className="col-span-3"
                            
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end" className="text-right">
                            End time
                        </Label>
                        <Input
                            id="end"
                            type="datetime-local"
                            value={end}
                            onChange={(e) => setend(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>{task ? 'Update' : 'Add task'}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


