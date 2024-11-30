const express = require('express')
const router = express.Router()
const taskController = require('../controllers/task_controller')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
router.route("/getUserTasks").get(taskController.getUserTasks)
router.route("/create").post(taskController.createTask)
router.route("/delete").delete(taskController.deleteTask)
router.route("/update").post(taskController.updateTask)



module.exports = router