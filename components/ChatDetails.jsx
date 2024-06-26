"use client";

import { pusherClient } from "@lib/pusher";
import { AddPhotoAlternate } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import MessageBox from "./MessageBox";

const ChatDetails = ({ chatId }) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [text, setText] = useState("");

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setOtherMembers(
        data?.members?.filter((member) => member._id !== currentUser._id)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  const sendText = async () => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text,
        }),
      });

      if (res.ok) {
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendPhoto = async (result) => {
    try {
      const res = fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    pusherClient.subscribe("chatId");

    const handleMessage = (newMessage) => {
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
    };

    pusherClient.bind("newMessage", handleMessage);

    return () => {
      pusherClient.unsubscribe("chatId");
      pusherClient.unbind("newMessage", handleMessage);
    };
  }, ["chatId"]);

  //scrolling down to the bottom when new message is received
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-details">
      <div className="chat-header">
        {chat?.isGroup ? (
          <>
            <Link href={`/chats/${chatId}/group-info`}>
              <img
                src={chat?.groupPhoto || "/assets/group.png"}
                alt="group photo"
                className="profilePhoto"
              />{" "}
            </Link>

            <div className="text">
              <p>
                {chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                members
              </p>
            </div>
          </>
        ) : (
          <>
            <img
              src={otherMembers[0].profileImage || "/assets/person.jpg"}
              alt="profile photo"
              className="profilePhoto"
            />
            <div className="text">
              <p>{otherMembers[0].username}</p>
            </div>
          </>
        )}
      </div>

      <div className="chat-body">
        {chat?.messages?.map((message) => (
          <MessageBox
            key={message._id}
            message={message}
            currentUser={currentUser}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="send-message">
        <div className="prepare-message">
          <CldUploadButton
            uploadPreset="vcrkjj3o"
            options={{ maxFiles: 1 }}
            onUpload={sendPhoto}
          >
            <AddPhotoAlternate
              sx={{
                fontSize: "35px",
                color: "#737373",
                cursor: "pointer",
                "&:hover": { color: "red" },
              }}
            />
          </CldUploadButton>

          <input
            type="text"
            placeholder="Write a message..."
            className="message-input-field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <div onClick={sendText}>
            <img src="/assets/send.jpg" alt="send" className="send-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
