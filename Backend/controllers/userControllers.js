const expressAsyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const tokenHandler = require("../config/genereateToken");
const bcrypt = require("bcryptjs");
const sendmail = require("../config/sendmail");

exports.registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }

  const userExists = await User.findOne({ email });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (userExists) {
    res.status(400);
    throw new Error("user exist already");
  }

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    pic: pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: tokenHandler.generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
    
  }
});

exports.authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: tokenHandler.generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or password");

  }
});

// /api/user/?search=sainath
exports.allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

// /api/user/resetpassword
exports.forgotPassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = tokenHandler.generateResetToken(user._id);

    let text = `This is token is valid for only 10 mins.\n\n ${resetToken} \n\n Copy the above token to set password.`;

    try {
      sendmail({
        email: user.email,
        subject: "To Reset Password",
        text: text,
      });
    } catch (err) {
      console.log(err);
      res.redirect("/api/user/login");
    }

    res.redirect(`http://localhost:5000/api/user/resetpassword/${user._id}`);
  }else{
    res.status(400);
    res.redirect("http://localhost:5000/api/user/login");
  }
});
