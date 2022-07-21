const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sinu0842@gmail.com',
      pass: 'yplpfejtziglehjs'
    }
  });




loginRouter.post('/api/login', async (req, res)=>{
    try {
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({error:"Please Fill the data"});
        }

        const udata = await user.findOne({email});
        
        if (udata){
            const isMatch = await bcrypt.compare(password, udata.password);
           
        

       

        if(!isMatch){
            res.status(400).json({error:"Invalid Credientials"});

        }else{
            const token = await udata.generateAuthToken();
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
        const otp = Math.floor(1000 + Math.random() * 9000);
        const {password, email} = req.body;
        const mailOptions = {
            from: 'sinu0842@gmail.com',
            to: email,
            subject: 'Netflix Account verification',
            html: `<p>Dear,<br>We thank you for your registration at Netflix Online streaming platforms</p><br/><p>Your user id is :${email}<p/><p>Your email id Verification OTP code is :</p><h1>${otp}</h1><p>Warm Regards,<br/>
            Customer Care<br/>
            Internet Ticketing<br/>
            NETFLIX<br/><br/>
            * Terms & Conditions Apply
            </p>`
          };
        
            const adata = new user({
                email: email,
                password: password,
                otp: otp
            });
            transporter.sendMail(mailOptions);

            const token = await adata.generateAuthToken();

            const sdata = await adata.save();
            res.status(200).send({token:token,message:"user register successfully"});
     
       
      

    } catch (err) {
        res.status(401).send(err);
        console.log(err);
    }
})
loginRouter.post('/api/otp/resend', async (req, res)=>{
    try {

        const gotp = Math.floor(1000 + Math.random() * 9000).toString();
        const {email} = req.body;
        const mailOptions = {
            from: 'sinu0842@gmail.com',
            to: email,
            subject: 'Netflix Account verification',
            html: `<p>Dear,<br>We thank you for your registration at Netflix Online streaming platforms</p><br/><p>Your user id is :${email}<p/><p>Your email id Verification OTP code is :</p><h1>${gotp}</h1><p>Warm Regards,<br/>
            Customer Care<br/>
            Internet Ticketing<br/>
            NETFLIX<br/><br/>
            * Terms & Conditions Apply
            </p>`
          };
          const otp = await bcrypt.hash(gotp, 12);
          const update = await user.updateOne({email:email},{otp:otp});
            transporter.sendMail(mailOptions);

            res.status(200).send({message:"Otp send"});  

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
loginRouter.post('/api/verify/otp', async (req, res)=>{
    try {
        const {otp, email} = req.body;

        const udata= await user.findOne({email});

        const isMatch = await bcrypt.compare(otp, udata.otp);
        
        if(isMatch){
            const update = await user.updateOne({email:email},{verified:true});
            res.status(200).send({message:"verified"});
            }
       
      

    } catch (err) {
        res.status(401).send({err:err,message:"Invalid"});
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