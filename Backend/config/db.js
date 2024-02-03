const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.messasge}`);
    process.exit();
  }
};

module.exports = connectDB;
