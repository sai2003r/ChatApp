
const User = require("../models/UserModel.js");
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

exports.protect = asyncHandler(async ( req,res,next) => {
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        token =  req.headers.authorization.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("Not authorized, token failed");
            }
            console.log(decoded);
            req.user = await User.findOne({ _id: decoded.id }).select("-password");
            return next();
        });
    }

    console.log(token);
    if(!token){
        res.status(401);
        throw new Error("Not authorized,no token");
    }
})