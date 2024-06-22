"use client";

import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { error },
  } = useForm();

  return (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="edit-profile">
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[a-zA-Z0-9_.]+$/,
                message:
                  "Username can only contain letters, numbers, underscores, and dots",
              },
            })}
            type="text"
            className="input-field"
            placeholder="Username"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>

        <div className="flex justify-between items-center">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile image"
            className="w-40 h-40 rounded-full"
          />
          <p className="text-body-bold">Upload new photo</p>
        </div>

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
