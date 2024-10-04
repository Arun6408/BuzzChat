const mongoose = require('mongoose');

const mongooseSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    recipientId:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    text:String
},{timestamps:true});

module.exports = mongoose.model('Message', mongooseSchema);