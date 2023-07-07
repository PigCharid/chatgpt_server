import { Configuration, OpenAIApi } from "openai";
import MessageModal from "../models/message.js";
import * as dotenv from "dotenv";
dotenv.config();
export const aichat = async (req, res) => {
  const { id, reChatID, role, prompt } = req.body;

  console.log("id", id);
  console.log("role", role);
  console.log("prompt", prompt);
  console.log("reChatID", reChatID);
  // 检查参数信息
  if (prompt === undefined || "") {
    res.status(510).json({ message: "咨询信息不能为空" });
  }
  try {
    if (reChatID === 0) {
      await MessageModal.create({
        id: id,
        role: role,
        content: prompt,
        createdAt: new Date(),
      });
    }

    const histMessages = await MessageModal.find({ id });

    console.log("message", histMessages);
    // 组上下文对象
    let messages = histMessages.map(({ role, content }) => ({
      role,
      content,
    }));
    if (reChatID !== 0) {
      messages = messages.slice(0, reChatID - 1);
    }
    console.log("aaaa");
    console.log("组成的对象", messages);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    console.log("chatCompletion", chatCompletion);
    console.log(chatCompletion.data.choices[0].message);
    res.status(200).json({ message: chatCompletion.data.choices[0].message });
    await MessageModal.create({
      id: id,
      role: chatCompletion.data.choices[0].message.role,
      content: chatCompletion.data.choices[0].message.content,
      createdAt: new Date(),
    });
  } catch (error) {
    console.log("error", error);
    await MessageModal.create({
      id: id,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    });
    res.status(510).json({ message: "AI咨询网络错误" });
  }
};
