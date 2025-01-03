const mongoose = require("mongoose");

// Định nghĩa Schema MongoDB
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

// Xuất Schema để dùng ở nơi khác
module.exports = User;
