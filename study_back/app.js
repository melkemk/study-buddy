require('express-async-errors')
require('dotenv').config()
const express=require('express')
const cors=require('cors')
const app=express()
const user=require('./route/user')
app.use('/file', express.static('./files'));
const {volunteer}=require('./route/volunteer')
const handler=require('./handler')
app.use(cors())
app.use(express.static('static'))
app.use(express.json())
app.use('/api/user',user);
app.use('/api/volunteer',volunteer);
app.use(handler)
module.exports=app