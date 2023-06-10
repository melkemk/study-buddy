const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  messages: [{
    message: { type: String, required: true },
    time: { type: Date, default: Date.now }
  }]
});

messageSchema.set("toJSON", {
  transform: function (_, obj) {
    obj.id = obj._id;
    delete obj._id;
    delete obj._v;
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
