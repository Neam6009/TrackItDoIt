const express = require('express')
const router = express.Router()
const usersController = require('../controllers/user_controller')
// const verifyJWT = require('../middleware/verifyJWT')



router.route("/getAll").get(usersController.getAllUsers)
router.route("/register").post(usersController.createNewUser)


module.exports = router