const multer=require('multer')
const path=require('path')
const uniqueSuffix = Date.now() 
let fileName;
const storage = multer.diskStorage({
    destination:  (req, file, cb)=> cb(null, './cv'),
    filename:  (req, file, cb)=> {
      const ext=path.extname(file.originalname)
      const sanitizedFilename = file.originalname.slice(0,file.originalname.indexOf(ext)).replace(/\s+/g, '_');
      fileName= sanitizedFilename+uniqueSuffix+ext;
      cb(null,fileName )
      req.fileName=fileName;
},fileFilter: (req, file, cb)=> {
    if(file.mimetype==='application/zip')   cb(null, false)
      }})
const storageVolunteer = multer.diskStorage({
    destination:  (req, file, cb)=> cb(null, './files'),
    filename:  (req, file, cb)=> {
const ext=path.extname(file.originalname)
const sanitizedFilename = file.originalname.slice(0,file.originalname.indexOf(ext)).replace(/\s+/g, '_');
fileName= sanitizedFilename+uniqueSuffix+ext;
req.fileName=fileName;
cb(null,fileName )},fileFilter: (req, file, cb)=> {
    if(file.mimetype==='application/zip')   cb(null, false)
      }})


const  upload = multer({ storage: storage})
const  uploadVolunteer = multer({ storage: storageVolunteer})

module.exports = { upload, uploadVolunteer };
module.exports.fileName = fileName;
