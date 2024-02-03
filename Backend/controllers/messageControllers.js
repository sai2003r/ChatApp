const expressAsyncHandler = require('express-async-handler');
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');
const Chat = require('../models/ChatModel');

exports.sendMessage = expressAsyncHandler(async(req,res)=>{
    const {content , chatId} = req.body;

    if(!content || !chatId){
        console.log("invalid data passed in request");
        return res.sendStatus(400);
    }

    try{
        var message = await Message.create({
            sender: req.user._id,
            content: content,
            chat: chatId,
        })
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path: 'chat.users',
            select: "name pic email"
        })
        await Chat.findOneAndUpdate({_id: req.body.chatId},{
            latestMessage: message,
        });
        res.json(message);

    }catch(err){

    }
})

exports.allMessages = expressAsyncHandler(async(req,res)=> {
    try{
        const messages = await Message.find({chat: req.params.chatId})
            .populate("sender","name pic email")
            .populate("chat");

        res.json(messages);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
})