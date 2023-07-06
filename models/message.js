import mongoose from "mongoose";

// 邮箱 密码 用户名 logo id 积分
const messageSchema = mongoose.Schema({
  id: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String },
  state: { type: String },
  createdAt: {
    type: Date,
    required: true,
  },
});

const MessageModal = mongoose.model("MessageModal", messageSchema);

export default MessageModal;
