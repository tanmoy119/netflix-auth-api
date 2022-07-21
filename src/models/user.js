const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String
    }, 
    otp:{
        type:String,
        default:null
    },
    verified:{
        type:Boolean,
        default:false
    } ,
    tokens:[
        {
            token:{
                type:String
            }
        }
    ]

 });



 userSchema.pre("save", async function(next){
    if(this.isModified('password') || this.isModified('otp')){
        this.password = await bcrypt.hash(this.password, 12);
        this.otp = await bcrypt.hash(this.otp, 12);
    }
    next();

 });


 userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id:this._id}, process.env.SECRET);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
        
    }
 }

 const user = new mongoose.model('user', userSchema);

 module.exports = user;