const Task = require("../models/task_model");



const getUserTasks = async (req, res) => {
    const user = req.user
    const tasks = await Task.find({user:user._id})
    if (!tasks?.length) {
        return res.status(400).json([])
    }

    res.json(tasks)
    
}

const createTask = async(req,res)=>{
    const user = req.user
    const {title,priority, status,start,end} = req.body;

    if(!title || !priority || !status || !start || !end){
        return res.status(400).json({meesage:"Invalid task"})
    }
    const taskObject = {title,priority : priority,status,start : new Date(start),end : new Date(end),user:user}
    const task = await Task.create(taskObject)

    if(task) res.status(201).json({message:`New task created ${title}`})
    else res.status(400).json({meesage:"Invalid task"})
  
}

const deleteTask = async (req, res) => {
    try {
        const deleteList = req.body;
        
        if (!Array.isArray(deleteList) || deleteList.length === 0) {
            return res.status(400).json({ message: "Invalid input: Expected non-empty array of task IDs" });
        }

        const result = await Task.deleteMany({ _id: { $in: deleteList } });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No tasks found to delete" });
        }

        return res.status(200).json({ 
            message: `Successfully deleted ${result.deletedCount} tasks`,
            deletedCount: result.deletedCount
        });


    } catch (error) {
        console.error('Error in deleteTask:', error);
        return res.status(500).json({ 
            message: "Error occurred while deleting tasks",
            error: error.message 
        });
    }
};


const updateTask = async(req,res)=>{
    const newTask = req.body
    const user = req.user

    const task = await Task.findById(newTask._id);
    const id = newTask._id
    
    
    console.log(req.body)
    if (task.user._id.toString() !== user._id.toString()) {
        return res.status(401).json({message: "Unauthorized"})
    }
    const {_id ,title,priority,status,start,end} = newTask;
    const taskObject = {
        title:title,
        priority:priority,
        status:status,
        start:new Date(start),
        end:new Date(end)
    }
    if(task){
        const updatedTask =  await Task.findByIdAndUpdate(id,taskObject)
        
        res.status(200).json({message:`task updated ${newTask.title}`})
    }else{
        res.status(400).json({message: "task updation error"})
    }

}

module.exports={
    getUserTasks,
    createTask,
    deleteTask,
    updateTask
}