import { useContext, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import CurrentChat from "./CurrentChat";
import axios from "axios";
import ShowUser from "./ShowUser";
import { toast, ToastContainer } from "react-toastify";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const { id ,nameOfUser} = useContext(UserContext);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();
  const inputRef = useRef();


  useEffect(() => {
    return connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://buzz-chat-nu.vercel.app");
    setWs(ws);

    const handleMsg = (e) => handleMessage(e);
    ws.addEventListener("message", handleMsg);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log(`Disconnected trying to reconnect`);
        connectToWs();
      }, 1000);
    });

    return () => {
      ws.removeEventListener("message", handleMsg);
    };
  }

  function showOnlineUsers(peopleArray) {
    const people = {};
    peopleArray.forEach(({ id, username }) => {
      people[id] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlineUsers(messageData.online);
    } else {
      setMessages((prev) => [...prev, messageData]);
    }
  }

  function sendMessage(ev){
    if(ev)ev.preventDefault();
    const message = {
      recipientId: selectedUserId,
      text: inputMessage,
    };

    if (selectedUserId) {
      ws.send(JSON.stringify({ message: message }));
    }
    setInputMessage("");
  }

  function sendFile(ev) {
    ev.preventDefault();
  
    if (ev.target.files.length > 0) {
      toast.error("Couldn't Upload File Try Again Later", {
        position: "top-right",
        autoClose: 3000,
      });
  
      ev.target.value = ""; 
    }
  }

  function logout() {
    axios.post("/logout").then(() => {
      setUsername(null);
      setId(null);
    });
    window.location.href = "/";
  }

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // change messages when selectedUserId changes
  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
    if (inputRef.current) {
      inputRef.current.focus();
    } 
  }, [selectedUserId]);

  // get all people
  useEffect(() => {
    axios.get("/people").then((res) => {
      const users = res.data
        .filter((p) => p._id != id)
        .map((user) => ({
          ...user,
          online: onlinePeople[user._id] ? true : false,
        }));
      setAllUsers(users);
    });
  }, [onlinePeople]);

  

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  return (
    <div className="flex h-screen">
      <div className="bg-blue-100 h-full w-1/5 md:w-1/4 flex flex-col">
        <div className="flex flex-col flex-grow overflow-y-scroll overflow-x-hidden">
          <Logo />
          {allUsers.map((user) => (
            <ShowUser
              key={user._id}
              user={user}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
            />
          ))}
        </div>
        <div className="flex justify-between w-full md:items-end my-3  flex-col md:flex-row">
          <div className=" ml-2 md:ml-4 text-sm md:text-md font-semibold text-[15px] translate-y-[-10px]">
            Welcome!{" "}
            {nameOfUser[0].toUpperCase() + nameOfUser.slice(1).toLowerCase()}
          </div>
          <button
            onClick={logout}
            className=" ml-1 w-fit md:mr-5 bg-blue-400 py-1 md:py-2 px-2 md:px-4 rounded-lg text-white font-semibold shadow shadow-gray-500"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-blue-300 w-4/5 md:w-3/4 flex flex-col">
        <CurrentChat
          selectedUserId={selectedUserId}
          messages={messages}
          divUnderMessages={divUnderMessages}
          allUsers={allUsers}
          setMessages={setMessages}
        />
        {selectedUserId && (
          <div className="px-4 py-2">
            <form onSubmit={sendMessage} className="flex gap-1">
              <input

                type="text"
                value={inputMessage}
                autoFocus={true}
                ref = {inputRef}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here.."
                className="bg-white flex-grow border p-2 rounded-lg"
              />
              <label type="button" className=" mx-1 cursor-pointer bg-gray-300 rounded-full p-2">
                <input type="file" className="hidden" onChange={sendFile} />
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
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
              </label>
              <button className="bg-blue-500 p-2 text-white rounded-full ">
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
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Chat;
