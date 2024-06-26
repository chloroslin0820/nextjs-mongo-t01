"use client";

import { pusherClient } from "@lib/pusher";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Loader from "./Loader";

const ChatList = ({ currentChatId, isChatDetailsUpdated }) => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const res = await fetch(
        search !== ""
          ? `/api/users/${currentUser._id}/searchChat/${search}`
          : `/api/users/${currentUser._id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser || isChatDetailsUpdated) {
      getChats();
    }
  }, [currentUser, search, isChatDetailsUpdated]);

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              const updatedMessages = [
                ...chat.messages,
                updatedChat.messages[0],
              ];

              return { ...chat, messages: updatedMessages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search chat..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox
            chat={chat}
            key={index}
            currentUser={currentUser}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
