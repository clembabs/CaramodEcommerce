
const  mongoose  = require("mongoose");

const dbConnect = () => {
  try {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    mongoose.connect(process.env.MONGODB_URL, connectionParams);
    console.log("Database connected successfully");

  } catch (error){
    console.log(error)
    console.log("Error connecting to database");
  }
};


module.exports = dbConnect;