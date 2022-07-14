const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken');


loginRouter.post('/api/login', async (req, res)=>{
    try {
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({error:"Please Fill the data"});
        }

        const udata = await user.findOne({email});
        
        if (udata){
            const isMatch = await bcrypt.compare(password, udata.password);
            const token = await udata.generateAuthToken();
        

       

        if(!isMatch){
            res.status(400).json({error:"Invalid Credientials"});

        }else{
            res.status(200).json({message:"user sign successfully",token:token});

        }

    }else{
        res.status(400).json({error:"Invalid Credientials"});

    }

       
        
    } catch (err) {
        console.log(err);
    }
})

loginRouter.post('/api/register', async (req, res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password == cpassword){
            const adata = new user({
                name:req.body.name,
                email:req.body.email,
                password: req.body.password,

            });

            const sdata = await adata.save();
            res.status(200).send(sdata);
        }
       
      

    } catch (err) {
        res.status(401).send(err);
        console.log(err);
    }
})
loginRouter.post('/api/verify/jwt', async (req, res)=>{
    try {
        const token = req.body.token;

        const verifyToken = jwt.verify(token,process.env.SECRET);
        const rootUser= await user.findOne({_id: verifyToken._id, "tokens:token":token});
        if(rootUser){
            res.status(200).send(rootUser);
            }
       
      

    } catch (err) {
        res.status(401).send({err:err,message:"Invalid token"});
        console.log(err);
    }
})
loginRouter.post('/api/logout', async (req, res)=>{
    try {
        const token = req.body.token;

        const verifyToken = jwt.verify(token,process.env.SECRET);
        
        const rootUser= await user.findOne({ _id: verifyToken._id, "tokens:token": token });
        const tokens = rootUser.tokens.filter((el)=>el.token !== token);
        const rootUser1= await user.updateOne({_id:rootUser._id}, { $set:{tokens:tokens}});
        if(rootUser1){
            res.status(200).send(rootUser1);
            }
       
      

    } catch (err) {
        res.status(401).send({err:err,message:"Invalid token"});
        console.log(err);
    }
})

module.exports = loginRouter;