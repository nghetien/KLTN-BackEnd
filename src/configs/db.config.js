const mongoose = require("mongoose");

async function connect() {
  try {
    const mongoDbUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`;
    await mongoose.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect MongoDB Successfully!!!");
  } catch (error) {
    console.log(error);
    console.log("Connect MongoDB Failure!!!");
  }
}

module.exports = { connect };
