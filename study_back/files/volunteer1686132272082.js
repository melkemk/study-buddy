const {Router}=require('express');
const Volunteer=require('../model/volunteer')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const File=require('../model/file')
const Message=require('../model/message')
const {incorrectpasswordOrEmail}=require('../error')
const router=Router();
const {uploadVolunteer,upload}=require('../storage/storage')



const authorizeVolunteer = (req, res, next) => {
    const token = req.headers.authorization 
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const decoded = jwt.verify(token.split(' ')[1], process.env.JWT);
  req.id=decoded.id;
 
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




router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const  volunteer= await  Volunteer.findOne({email:email})
    if(volunteer){

    const ok=await bcrypt.compare(password,volunteer.password)
    if(ok){
    const jwtkey=jwt.sign({id:volunteer.id},process.env.JWT)
    res.json({jwt:jwtkey});
    }}else
        throw(new incorrectpasswordOrEmail('password or email not correct','passwordOrEmail',1000))
})



module.exports = {
  volunteer: router
  };