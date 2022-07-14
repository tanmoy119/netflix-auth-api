const mongoose = require('mongoose');

const conn = async ()=>{
    try {
        mongoose.connect(process.env.DB);
        console.log("connection successfull..");
    } catch (err) {
        console.log(err);
        console.log("no connection");
    }
}

conn();