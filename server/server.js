const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv");

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO).then(()=>{console.log("mongo connection ok")}).catch((e)=>{console.log(e)});

app.use(express.json());

const port = process.env.PORT || 4001

app.use("/users",require("./routes/user_route"))
app.use('/auth',require('./routes/auth_route'));

app.listen(port ,()=>{
    console.log(`server live at ${port}`)
})