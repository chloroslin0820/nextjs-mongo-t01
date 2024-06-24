import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { userId } = params;

    const allChats = await Chat.find({ members: userId })
      .sort({
        lastMessageAt: -1,
      })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (error) {
    console.log(error);

    return new Response("Failed to get all chats of current user", {
      status: 500,
    });
  }
}
