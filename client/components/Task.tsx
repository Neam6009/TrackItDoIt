
import { Checkbox } from "@/components/ui/checkbox"
import { Task as TaskType } from '@/types'
import { useState } from 'react'


type TaskProps = {
    task: TaskType
    onComplete: (id: string) => void
}

export function Task({ task, onComplete }: TaskProps) {
    const [isChecked, setIsChecked] = useState(task.status.toLocaleLowerCase() === 'finished')

    const handleComplete = () => {
        setIsChecked(true)
        onComplete(task._id || "")
    }

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg mb-2">
            <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-500">
                    Start: {(task.start || new Date()).toLocaleString()} |
                    End: {(task.end || new Date()).toLocaleString()} |
                    Priority: {task.priority}
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={`task-${task._id}`}
                    checked={isChecked}
                    onCheckedChange={handleComplete}
                    disabled={task.status.toLocaleLowerCase() === 'finished'}
                />
                <label htmlFor={`task-${task._id}`}>
                    {task.status.toLocaleLowerCase() === 'finished' ? 'Completed' : 'Mark as complete'}
                </label>
            </div>
        </div>
    )
}


