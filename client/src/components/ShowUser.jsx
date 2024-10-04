import React from "react";
import Avatar from "./Avatar";

const ShowUser = ({user,selectedUserId,setSelectedUserId}) => {
  const name = user.name[0].toUpperCase() + user.name.slice(1).toLowerCase();
  return (
    <div
      onClick={() => setSelectedUserId(user._id)}
      key={user._id}
      className={
        "border-b relative border-grey-900 flex gap-3 items-center " +
        (user._id === selectedUserId ? "bg-blue-200" : "")
      }
    >
      {user._id === selectedUserId && (
        <div className="w-1 absolute h-full bg-blue-500 rounded-3xl"></div>
      )}
      <div className="flex items-center gap-3 py-3 pl-6">
        <Avatar
          name={user.name}
          userId={user._id}
          online={user.online}
        />
        <span className="hidden md:flex text-lg text-gray-800 cursor-pointer flex-grow ">
          {name}
        </span>
        {user.online && (
          <span className="text-green-500 text-sm">(Online)</span>
        )}
      </div>
    </div>
  );
};

export default ShowUser;
