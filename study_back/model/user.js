const mongoose=require('mongoose')

const Schema=mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stream: { type: String, required: true }
   , jwt:{type:Array}})

Schema.set("toJSON", {
        transform: (_, obj) => {
          obj.id = obj._id
          delete obj._id
          delete obj.__v
        },
      })
const User=mongoose.model('users',Schema);

module.exports=User;
