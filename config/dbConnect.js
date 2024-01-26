const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database is connected successfully");
  } catch (error) {
    console.log(`Error while connecting to DataBase ${error}`);
  }
};

module.exports = dbConnect;
