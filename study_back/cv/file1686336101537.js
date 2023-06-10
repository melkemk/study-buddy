const mongoose = require('mongoose');
const Volunteers = require('./volunteer');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Volunteers' },
  path: { type: String, required: true, unique: false },
  time:{type:Date,default:Date.now()}
});

fileSchema.set("toJSON", {
  transform: function (_, obj) {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
