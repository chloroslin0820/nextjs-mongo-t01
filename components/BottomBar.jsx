"use client";

import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomBar = () => {
  const pathName = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="bottomBar">
      <Link
        href="/chats"
        className={`${
          pathName === "/chats" ? "text-red-1" : ""
        }  text-heading4-bold`}
      >
        Chats
      </Link>
      <Link
        href="/contacts"
        className={`${
          pathName === "/contacts" ? "text-red-1" : ""
        }  text-heading4-bold`}
      >
        Contacts
      </Link>

      <Logout
        sx={{ color: "#737373", cursor: "pointer" }}
        onClick={handleLogout}
      />

      <Link href="/profile">
        <img
          src={user?.profileImage || "/assets/person.jpg"}
          alt="profile image"
          className="profilePhoto"
        />
      </Link>
    </div>
  );
};

export default BottomBar;
