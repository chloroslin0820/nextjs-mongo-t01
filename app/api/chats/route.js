import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();

    const { currentUserId, members, isGroup, name, groupPhoto } = body;
    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );

      await chat.save();

      await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { chats: chat._id } },
        { new: true }
      );
    }
    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create a new chat", { status: 500 });
  }
}
