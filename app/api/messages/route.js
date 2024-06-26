import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";
import mongoose from "mongoose";

mongoose.set("strictPopulate", false);

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    // trigger a pusher event for the new message
    await pusherServer.trigger("chatId", "newMessage", newMessage);

    // trigger a pusher event for the updated chat
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (error) {
        console.error(
          "Failed to trigger pusher event for member: ",
          member._id.toString()
        );
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create new message", { status: 500 });
  }
}
