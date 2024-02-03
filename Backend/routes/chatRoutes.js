const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const chatController = require("../controllers/chatControllers.js");

const router = express.Router();

router.route('/').post(protect, chatController.accessChat);
router.route('/').get(protect, chatController.fetchChats);
router.route('/group').post(protect, chatController.createGroupChat);
router.route('/rename').put(protect,chatController.renameGroup);
router.route('/groupadd').put(protect,chatController.addToGroup);
router.route('/groupremove').put(protect,chatController.removeFromGroup);

module.exports = router;