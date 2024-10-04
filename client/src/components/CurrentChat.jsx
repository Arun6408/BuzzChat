import axios from "axios";
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import { toast } from "react-toastify"; 

const CurrentChat = ({ messages, setMessages, divUnderMessages, selectedUserId, allUsers }) => {
  const { id } = useContext(UserContext);

  function getTime(time) {
    const date = new Date(time);
    const istOffset = 5 * 60 + 30;
    const istTime = new Date(date.getTime() + istOffset * 60 * 1000);
    const hours = ("0" + istTime.getHours()).slice(-2);
    const minutes = ("0" + istTime.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  function deleteChat() {
    axios
      .post("/deleteChat", {
        senderId: id,
        recipientId: selectedUserId,
      })
      .then((res) => {
        toast.success("Messages deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setMessages([]);
      })
      .catch((err) => {
        toast.error("Failed to delete messages. Try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  }

  const user = allUsers.find((u) => u._id === selectedUserId);
  const name = user ? user.name : "";

  return (
    <div className="flex-grow relative">
      {selectedUserId ? (
        <div className="w-full h-full relative flex flex-col">
          <div className="h-16 bg-blue-400 rounded-lg flex">
            <div className="py-3 px-4 flex flex-grow">
              <Avatar name={name} userId={selectedUserId} online={false} />
              <span className="translate-y-2 px-3">
                {name[0]?.toUpperCase() + name.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="h-full px-5 flex items-center" onClick={deleteChat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col flex-grow inset-0 absolute top-16 overflow-y-scroll custom-scrollbar mt-1">
            {messages.map((message, index) => {
              const isSender = message.senderId === id;
              return (
                <div key={index} className={isSender ? "text-right" : "text-left"}>
                  <div
                    className={
                      "px-3 py-2 rounded-lg my-2 mx-1 inline-block text-sm" +
                      (isSender ? " bg-blue-500 text-white" : " bg-white text-gray-700")
                    }
                  >
                    {message.text}
                    <span className="text-[10px] relative top-1 px-1">{` ${getTime(message.updatedAt)}`}</span>
                  </div>
                </div>
              );
            })}
            <div className="w-1 h-1" ref={divUnderMessages}></div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col w-full items-center justify-center">
          <div className="text-center text-black font-semibold text-xl">
            Select a user to start chatting
          </div>
          <div className="text-center text-gray-700">
            Click on a user's name to start a conversation
            <div>{allUsers.length === 0 ? "No users available..." : ""}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentChat;
