const express = require('express');
const { register, profile, login, people, logout } = require('../controller/authController');
const { getMessagesForUser, deleteChat } = require('../controller/messageController');

const router = express.Router();

//Login Routes
router.post('/register',register).post('/login',login).get('/profile',profile).get('/people',people).post('/logout',logout ).post('/deleteChat',deleteChat);

//Message Routes
router.get('/messages/:id',getMessagesForUser);
module.exports = router;