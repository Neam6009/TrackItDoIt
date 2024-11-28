const User = require('../models/user_model')

const bcrypt = require('bcrypt')


const getAllUsers = async (req, res) => {

    const users = await User.find().select('-password').lean()


    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
}

 
const createNewUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }


    const hashedPwd = await bcrypt.hash(password, 10) 

    const userObject = { email, "password": hashedPwd }

    const user = await User.create(userObject)

    if (user) { 
        res.status(201).json({ message: `New user ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}




module.exports = {
    getAllUsers,
    createNewUser
}