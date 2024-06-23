"use client";

import { RadioButtonUnchecked } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  const { data: session } = useSession();
  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const res = await fetch(
        search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
      );
      const data = await res.json();
      const filteredContacts = data.filter(
        (contact) => contact._id !== currentUser.id
      );

      setContacts(filteredContacts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);

  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      <input
        placeholder="Search contact..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>
          {contacts.map((user, index) => (
            <div key={index} className="contact">
              <RadioButtonUnchecked />
              <img
                src={user.profileImage || "/assets/person.jpg"}
                alt="profile image"
                className="profilePhoto"
              />
              <p className="text-base-bold">{user.username}</p>
            </div>
          ))}
        </div>

        <div className="create-chat">
          <button className="btn">START A NEW CHAT</button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
Contacts;
