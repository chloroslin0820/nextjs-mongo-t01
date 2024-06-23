"use client";

import { useSession } from "next-auth/react";

const Chats = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return <div>{session && <p>User Email: {session.user.email}</p>}</div>;
};

export default Chats;
