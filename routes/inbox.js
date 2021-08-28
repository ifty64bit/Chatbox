const express = require('express');
const inboxRouter = express.Router();
const { checkLogin } = require('../utility/checkLogin');
const messages = require('../model/message');
const messageE = [{msg:"No Message"}];
async function getOldMsg(req, res, next) {
    const to = req.params.uname;
    const from = req.user;
    
    console.log("Sender: "+from+" Reciver: "+to);
    const message = await messages.find({
        $and: [{ users: from }, { users: to }]
    });
    if (message.length == 0) {
        
        
        console.log(messageE);
        res.render('inbox', { title: 'Inbox', user: to, from: from, msg: message });
    }
    else {
        console.log(message);
        res.render('inbox', { title: 'Inbox', msg: message, user: to, from: from });
    }

}

inboxRouter.get('/:uname', checkLogin, getOldMsg, (req, res) => {
    
})

module.exports = inboxRouter;