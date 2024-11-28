const express = require('express')
const router = express.Router()
const taskController = require('../controllers/task_controller')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
router.route("/getAll").get(taskController.getAllTasks)
router.route("/create").get(taskController.createTask)
router.route("/delete/:id").delete(taskController.deleteTask)
router.route("/update/:id").post(taskController.updateTask)



module.exports = router