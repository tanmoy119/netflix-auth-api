const mongoose = require('mongoose');

mongoose.connect(`${process.env.DB}`).then(()=>{
    console.log('connection successfull..');
}).catch((err)=>{
    console.log(err);
    console.log('no connection..!!');
})