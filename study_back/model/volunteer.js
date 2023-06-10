const mongoose=require('mongoose')

const volunteerSchema=mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stream: { type: String, required: true },
cv:{type:String,required:true},jwt:{type:Array}
})


volunteerSchema.set("toJSON", {
        transform: (_, obj) => {
          obj.id = obj._id
          delete obj._id
          delete obj.__v
        },
      })
const Volunteers=mongoose.model('volunteers',volunteerSchema);

module.exports=Volunteers;
