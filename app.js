const express = require('express')
const app = express()

// importing Mongoose
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5000

const {MONGOURI} = require('./config/keys')

const path = require('path')  




mongoose.connect(MONGOURI,{
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useFindAndModify: false 
})

mongoose.connection.on('connected',()=>{
    console.log('connected to mongodb')
})

mongoose.connection.on('error',(err) =>{
    console.log('error connecting ',err)
})

require('./models/user')
require('./models/post')


const bodyParser = require('body-parser')




app.use(bodyParser.json())


app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
      
    app.get("*",(req,res) =>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server running on ",PORT)
})
