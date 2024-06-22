"use client";

import { useSession } from "next-auth/react";

const Chats = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  } else {
    console.log(session);
  }

  return <div>{session && <p>User Email: {session.user.email}</p>}</div>;
};

export default Chats;
