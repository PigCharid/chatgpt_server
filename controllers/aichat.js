import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
dotenv.config();
export const aichat = async (req, res) => {
  try {
    console.log(process.env.OPENAI_API_KEY);
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello world" }],
    });
    console.log("chatCompletion", chatCompletion);
    console.log(chatCompletion.data.choices[0].message);
    res.status(200).json({ result: chatCompletion.data.choices[0].message });
  } catch (error) {
    console.log("error", error);
    res.status(510).json({ message: error.message });
  }
};
