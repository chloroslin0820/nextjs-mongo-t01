"use client";

import ChatDetails from "@components/ChatDetails";
import ChatList from "@components/ChatList";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const { chatId } = useParams();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const seenMessages = async () => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId: currentUser._id }),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [isChatDetailsUpdated, setIsChatDetailsUpdated] = useState(false);

  useEffect(() => {
    if (currentUser && chatId) {
      seenMessages();
    }
  }, [currentUser, chatId]);

  const updateChatDetails = () => {
    setIsChatDetailsUpdated((prev) => !prev);
  };

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList
          currentChatId={chatId}
          isChatDetailsUpdated={isChatDetailsUpdated}
        />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} updateChatDetails={updateChatDetails} />
      </div>
    </div>
  );
};

export default ChatPage;
