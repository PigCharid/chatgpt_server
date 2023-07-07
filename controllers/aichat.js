import { Configuration, OpenAIApi } from "openai";
import MessageModal from "../models/message.js";
import * as dotenv from "dotenv";
dotenv.config();
export const aichat = async (req, res) => {
  let { id, reChatID, role, prompt, reChat } = req.body;

  console.log("id", id);
  console.log("role", role);
  console.log("prompt", prompt);
  console.log("reChatID", reChatID);
  console.log("reChat", reChat);
  // 检查参数信息
  if (!reChat) {
    if (prompt === undefined || "") {
      res.status(510).json({ message: "咨询信息不能为空" });
    }
  }
  try {
    if (reChat === false) {
      await MessageModal.create({
        id: id,
        reChatID: reChatID,
        role: role,
        content: prompt,
        createdAt: new Date(),
      });
      await MessageModal.create({
        id: id,
        reChatID: reChatID + 1,
        role: "assistant",
        content: "",
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
    messages = messages.slice(0, messages.length - 1);
    if (reChatID === true) {
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
    // console.log("chatCompletion", chatCompletion);
    console.log(chatCompletion.data.choices[0].message);
    res.status(200).json({ message: chatCompletion.data.choices[0].message });
    if (!reChat) {
      reChatID += 1;
    }
    // const oldVerify = await MessageModal.findOneAnd({ id, reChatID });
    // console.log("oldVerify", oldVerify);
    await MessageModal.updateOne(
      {
        id: id,
        reChatID: reChatID,
      },
      {
        id: id,
        reChatID: reChatID,
        role: "assistant",
        content: chatCompletion.data.choices[0].message,
        createdAt: new Date(),
      }
    );
  } catch (error) {
    console.log("error", error);
    res.status(510).json({ message: "AI咨询网络错误" });
  }
};
