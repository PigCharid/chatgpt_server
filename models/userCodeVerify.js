import mongoose from "mongoose";

// 邮箱验证码登录
const userVerfiy = mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
  },
});

const UserVerfiyModal = mongoose.model("UserVerfiyModal", userVerfiy);

export default UserVerfiyModal;
