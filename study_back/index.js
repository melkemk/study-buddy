const app=require('./app');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/study',{   useNewUrlParser: true,
useUnifiedTopology: true}).then(()=>{
    let port =5050;
app.listen(port,()=>console.log('connected on http://localhost:'+port))}
)
