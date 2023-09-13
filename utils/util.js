const { hash, genSalt } = require("bcrypt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: async function (pwd) {
    const salt = await genSalt(10);
    const hashed = hash(pwd, salt);
    return hashed;
  },

  // Generate JWT
  generateToken: function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  },

  generateRefreshToken: function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  },

  isPasswordMatched: async function (enteredPwd, pwd) {
    return await bcrypt.compare(enteredPwd, pwd);
  },
};
