const Task = require("../models/task_model");



const getAllTasks = async (req, res) => {
    const user = req.user
    const tasks = await Task.find({user:user})


    if (!tasks?.length) {
        return res.status(400).json({ message: 'No tasks found' })
    }

    res.json(tasks)
}

const createTask = async(req,res)=>{
    const {title,priority, status,start,end} = req.body;
    if(!title || !priority || status || start ||end){
        "All fields are required"
    }
    const taskObject = {title,priority,status,start,end}

    const task = await Task.create(taskObject)

    if(task) res.status(201).json({message:`New task created ${title}`})
    else res.status(400).json({meesage:"Invalid task"})
  
}
const deleteTask = async (req,res,id)=>{
    const task = await Task.findById(id);
    if(task){
        await Task.findByIdAndDelete(id);
        res.status(200).json({message:`task deleted ${id}`})
    }else{
        res.status(400).json({message: "task deletion error"})
    }



}
const updateTask = async(req,res)=>{
    const user = req.user
    const task = await Task.findById(id);
    const {title,priority, status,start,end} = req.body;
    if (!task.user !== user._id) {
        return res.status(401).json({message: "Unauthorized"})
    }
    if(task){
        const updatedTask =  await Task.findByIdAndUpdate(id,{ title: title }, 
            { priority: priority },
            {status: status},
            {start : start},
            {end:end});
        res.status(200).json({message:`task updated ${id}`})
    }else{
        res.status(400).json({message: "task updation error"})
    }

}

module.exports={
    getAllTasks,
    createTask,
    deleteTask,
    updateTask
}