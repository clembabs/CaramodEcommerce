const { default: mongoose } = require("mongoose");

const validateMongoDbID = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("Invalid ID");
};

module.exports = validateMongoDbID;