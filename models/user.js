import mongoose from "mongoose";

// 邮箱 密码 用户名 logo id 积分
const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String },
  logo: { type: String },
  integral: { type: Number },
});

const UserModal = mongoose.model("UserModal", userSchema);

export default UserModal;
