const express  = require("express");
const userController = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware.js");

const UserRouter = express.Router();

UserRouter.route('/').post(userController.registerUser);
UserRouter.route('/login').post(userController.authUser);
UserRouter.route('/').get(protect,userController.allUsers);
// UserRouter.route('/forgotpassword').post(userController.forgotPassword);
// UserRouter.route('/resetpassword/:userId').patch();
module.exports = UserRouter;