const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler')

dotenv.config();

const app = express();
const frontend_url = [
    'http://localhost:3001',   
    process.env.FRONTEND_URL,
   
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || frontend_url.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,          
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200   
};

app.use(cors(corsOptions));


mongoose.connect(process.env.MONGO).then(()=>{console.log("mongo connection ok")}).catch((e)=>{console.log(e)});

app.use(express.json());

const port = process.env.PORT || 4001

app.get("/",(req,res)=>{
    res.send("This is the backend server of Track it Do it app")
})
app.use("/users",require("./routes/user_route"))
app.use("/tasks",require("./routes/task_route"))
app.use('/auth',require('./routes/auth_route'));

app.get("/*",(req,res)=>{
    res.send("page not found")
})

app.use(errorHandler)

app.listen(port ,()=>{
    console.log(`server live at ${port}`)
})