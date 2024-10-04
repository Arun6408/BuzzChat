const jwt = require('jsonwebtoken');
const Message = require('../models/message');

const getUserData = async (req) => {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("Not authenticated");
    }
  });
};

const getMessagesForUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await getUserData(req);
        if (!userData) {
          return res.status(401).json({ status: "error", error: "Not authenticated" });
        }
        const messages = await Message.find({
            senderId : {$in : [userData.id,userId]},
            recipientId : {$in : [userData.id,userId]},
        }).sort({createdAt:1});
        res.json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error });
    }
};

const deleteChat = async(req,res)=>{
  const {senderId , recipientId} = req.body
  const messages = await Message.deleteMany({
    senderId : {$in : [senderId,recipientId]},
    recipientId : {$in : [senderId,recipientId]},
  })
  res.json(messages);
}

module.exports = {
  getMessagesForUser,
  deleteChat
};
