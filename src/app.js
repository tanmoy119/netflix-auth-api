require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json());
const loginRouter = require("./routers/login");



const port = process.env.PORT || 5000;

require('./db/conn');

app.use(loginRouter);
 

app.listen(port, ()=>{
    console.log(`listening at port-${port}`);
})
