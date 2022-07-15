require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
const loginRouter = require("./routers/login");

app.use(cors());


const port = process.env.PORT || 5000;

require('./db/conn');

app.use(loginRouter);
 

app.listen(port, ()=>{
    console.log(`listening at port-${port}`);
})
