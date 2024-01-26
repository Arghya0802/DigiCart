const mongoose = require("mongoose");

const validate_mongoDB_ID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) throw new Error("Given MongoDB ID is Invalid or Not Found");
};

module.exports = validate_mongoDB_ID;
