import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [nameOfUser, setNameOfUser] = useState(null);
  const [emailOfUser, setEmailOfUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token"); 
    console.log(token);
    if (token) {
      axios
        .get("/profile")
        .then((res) => {
          setUsername(res.data.username);
          setId(res.data.id);
          setEmailOfUser(res.data.email);
          setNameOfUser(res.data.name);
        })
        .catch((err) => {
          toast.error("Couldn't fetch profile. Please relogin!", {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClose: () => {
              Cookies.remove("token");
              window.location.href = "/";
            },
          });
        });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        id,
        setId,
        nameOfUser,
        setNameOfUser,
        emailOfUser,
        setEmailOfUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
