const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },
    status: {
        type: String,
    },
    start: {
        type: Date,
    },
    end: {
        type: Date, 
    },
    user: {
        ref: "User",
        type: mongoose.Types.ObjectId
    }
}, { timestamps: true });


const Task = mongoose.model('Task',taskSchema);

module.exports = Task;