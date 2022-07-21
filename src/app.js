require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
const loginRouter = require("./routers/login");

app.use(cors());
// const allowedOrigins = ["http://localhost:3000","http://localhost:5000"];

//     app.use(
//         cors({
//             origin: function(origin, callback) {
//                 if (!origin) return callback(null, true);
//                 if (allowedOrigins.indexOf(origin) === -1) {
//                     var msg =
//                         "The CORS policy for this site does not " +
//                         "allow access from the specified Origin.";
//                     return callback(new Error(msg), false);
//                 }
//                 return callback(null, true);
//             }
//         })
//     ); 


const port = process.env.PORT || 5000;

require('./db/conn');

app.use(loginRouter);
 

app.listen(port, ()=>{
    console.log(`listening at port-${port}`);
})
