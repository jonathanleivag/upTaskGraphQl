const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('====================================');
    console.log("DB connect");
    console.log('====================================');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = { connectDb };