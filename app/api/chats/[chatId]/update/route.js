import Chat from "@models/Chat";
import { connectToDB } from "@mongodb";

export async function POST(req, { params }) {
  try {
    await connectToDB();
    const body = await req.json();
    const { chatId } = params;

    const { name, groupPhoto } = body;
    const updateGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    return new Response(JSON.stringify(updateGroupChat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update group chat info", { status: 500 });
  }
}
