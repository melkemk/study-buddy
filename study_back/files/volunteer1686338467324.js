const {Router}=require('express');
const Volunteer=require('../model/volunteer')
const User=require('../model/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const File=require('../model/file')
const Message=require('../model/message')
const {incorrectpasswordOrEmail}=require('../error')
const router=Router();
const {uploadVolunteer,upload}=require('../storage/storage')

const authorizeVolunteer =async (req, res, next) => {
    const token = req.headers.authorization 
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const jwttoken=token.split(' ')[1]
  const decoded = jwt.verify(jwttoken, process.env.JWT);
  req.id=decoded.id;
  req.token=token;
 const volunteer= await Volunteer.findById(decoded.id);
 console.log(volunteer)
if(!volunteer.jwt.includes(jwttoken)) 
    return res.status(401).json({ error: ' token expired' });
  next(); 
}





router.post('/register',upload.single('cv'),async(req,res)=>{
    const {name,email,stream,username}=req.body;    
    const password=await bcrypt.hash(req.body.password,10);
    const volunteer={name:name,email:email,stream:stream,username:username,password:password,cv:'/cv/'+req.fileName}
    await Volunteer.create(volunteer);
    res.status(200).json({ succeed: 'yes' })
})

router.use('/upload',authorizeVolunteer)
router.post('/upload',uploadVolunteer.single('file'),async(req,res)=>{
    const file={ user: req.id, path:'/file/'+req.fileName}
    await File.create(file);
    res.status(200).json({ succeed: 'yes' })
})

router.use('/message',authorizeVolunteer)
router.post('/message/send',async(req,res)=>{

//they will tell me in body section to whom they are sending 

  await  Message.findOneAndUpdate(
 { user: req.body.id },
 { $push: { messages: {message:'mentoor:- '+req.body.message} } },
 { upsert: true, new: true }
); 
res.json('succeed')
})



router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const  volunteer= await  Volunteer.findOne({email:email})
    if(volunteer){

    const ok=await bcrypt.compare(password,volunteer.password)
    if(ok){
    const jwtkey=jwt.sign({id:volunteer.id},process.env.JWT)
    let jwtdb=volunteer.jwt;jwtdb.push(jwtkey)
   await  Volunteer.findByIdAndUpdate(volunteer.id, { jwt: jwtdb }, { new: true });
    res.json({jwt:jwtkey});
    }}else
        throw(new incorrectpasswordOrEmail('password or email not correct','passwordOrEmail',1000))
})

   
router.get('/users',authorizeVolunteer,async (req,res)=>{
  const   users=await User.find();
  let tojson=[];
  users.forEach(user=>{
    tojson.push({id:user.id,name:user.name,email:user.email})
  })
    res.json(tojson);
})

router.post('/logout',authorizeVolunteer,async (req,res)=>{
  console.log('hey')
let volunteer=await Volunteer.findById(req.id);
if(volunteer){
let jwt=volunteer.jwt;
jwt.filter(j=> j!=req.token)
await Volunteer.findByIdAndUpdate(volunteer.id,{jwt:jwt})
res.json({success:true})
}
})

module.exports = {
  volunteer: router
  };