const express = require('express')
const router = express.Router()


const mongoose = require('mongoose')
const User = mongoose.model("User")

// password encryption
const bcrypt = require('bcryptjs')

const {JWT_SECRET} = require('../config/keys')

const jwt = require('jsonwebtoken')

router.post('/signup',(req,res)=>{
    const {
        name,
        email,
        password,
        pic
    } = req.body

    if(!email || !password || !name){
        return res.status(422).json({
            error:"please fill all the fields"
        })
    }
    User.findOne({
        email:email
    })
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({
                error:"user already exits with email id"
            })
        }
         bcrypt.hash(password,12)
          .then(hashedpassword =>{
                const user = new User({
                    name,
                    email,
                    password:hashedpassword,
                    pic
                })
                user.save()
                 .then(user=>{
                    res.json({
                        message:"sign up successfully"
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            })

        .catch(err=>{
            console.log(err)
        })
           
        
    })
    .catch(err=>{
        console.log(err)
    })
    
    
})


router.post('/signin',(req,res)=>{
    const {
        email,
        password
    } =req.body
   if(!email || !password){
        return  res.status(422).json({
           error:"please enter email or password"
       })
   }
   User.findOne({
       email:email
   })
   .then((savedUser)=>{
       if(!savedUser){
          return res.status(422).json({
               error:"Invalid email or password"
           })
       }
       bcrypt.compare(password,savedUser.password)
       .then(domatch=>{
        if(domatch){
             
        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
        const {_id,name,email,followers,following,pic} = savedUser
        res.json({token,user:{_id,name,email,followers,following,pic}})
        }
        else{
            return res.status(422).json({
                error:"Invalid email or password"
            })
        }
        })
       .catch(err=>{
        console.log(err)
        })
    
   
       
   })
   .catch(err=>{
    console.log(err)
   })

})

module.exports = router