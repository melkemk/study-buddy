const {Router, application}=require('express');
const User=require('../model/user')
const path=require('path')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const File=require('../model/file')
const Message=require('../model/message')
const Volunteer=require('../model/volunteer')
const {incorrectpasswordOrEmail}=require('../error')
const router=Router();
const extName = require('ext-name');
const Volunteers = require('../model/volunteer');

//login not working
const authorizeUser =async (req, res, next) => {
    const token = req.headers.authorization 
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decoded = jwt.verify(token.split(' ')[1], process.env.JWT);
  const jwttoken=token.split(' ')[1]
  req.id=decoded.id;
  req.stream=decoded.stream;
  req.token=jwttoken;
 const user= await User.findById(decoded.id);
 if(!user)  
       return res.status(401).json({ error: '  error' }); 
if(!user.jwt.includes(jwttoken)) 
    return res.status(401).json({ error: ' token expired' });
  next(); }




router.post('/register',async(req,res)=>{
    const {name,email,stream,username}=req.body;
    const password=await bcrypt.hash(req.body.password,10);
    const user={name:name,email:email,stream:stream,username:username,password:password}
    await User.create(user);
    console.log(user.name)
    res.status(200).json({ succeed: 'yes' })
})


router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const  user= await  User.findOne({email:email})
    if(user){
        const ok=await bcrypt.compare(password,user.password)
    if(ok){
      jwtkey=jwt.sign({id:user.id,stream:user.stream},process.env.JWT)
      user.jwt.push(jwtkey);
      const updatedUser = { jwt: user.jwt };
    const updatedUserDocument = await User.findByIdAndUpdate(user.id, updatedUser, { new: true });
    res.json({jwt:jwtkey});}
    }
    else
        throw(new incorrectpasswordOrEmail('password or email not correct','passwordOrEmail',1000))
})


router.use(authorizeUser);

  router.get('/info',(req,res)=>{
      res.json({"id":req.id,stream:req.stream})
  })

    
  router.get('/volunteers',async (req,res)=>{
    const   volunteers=await Volunteer.find();
    let tojson=[];
    volunteers.forEach(volunteer=>{
      tojson.push({id:volunteer.id,name:volunteer.name,email:volunteer.email})
    })
      res.json(tojson);
  })





router.get('/video',async(req,res)=>{
    const files = await File.find().sort({time:1})
    const valid=files.filter(file=>{
     return  extName(file['path'])[0]['mime'].startsWith('video')
    })
    res.json(valid)
})


router.get('/pdf', async (req, res) => {
    const files = await File.find().sort({time:1})
    const valid = files.filter(file => {
    return extName(file['path'])[0]['mime'].startsWith('application/pdf');
  });
  res.json(valid);
});
router.get('/ppt', async (req, res) => {
    const files = await File.find().sort({time:1})
    const valid = files.filter(file => {
    return extName(file['path'])[0]['mime'].startsWith('application/vnd.openxmlformats-officedocument.presentationml.presentation');
  });
  res.json(valid);
});
router.get('/other', async (req, res) => {
  const files = await File.find().sort({time:1})
  const valid = files.filter(file => {
    return !(
        extName(file['path'])[0]['mime'].startsWith('application/vnd.openxmlformats-officedocument.presentationml.presentation') ||
        extName(file['path'])[0]['mime'].startsWith('application/pdf') ||
        extName(file['path'])[0]['mime'].startsWith('video')
      );
      });
  res.json(valid);
});


 router.post('/message/send',async(req,res)=>{
     await  Message.findOneAndUpdate(
    { user: req.id },
    { $push: { messages: {message:'you:- '+req.body.message} } },
    { upsert: true, new: true }
  ); 
  res.json('succeed')
 })
router.post('/message/all',async(req,res)=>{
const file=await Message.find();
if(file){
const messages=file[0]['messages'].map(message=>{
  return {message:message.message,time:message.time}
})
res.json(messages)}
})


router.post('/logout',async (req,res)=>{
  let user=await User.findById(req.id);
  if(user){
  const updatedJwt = user.jwt.filter((token) => token !== req.token);
  res.json({success:await User.findByIdAndUpdate(user.id,{jwt:updatedJwt})
  })
  }
  })
  


module.exports=router;

