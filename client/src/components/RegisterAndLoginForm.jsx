import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { toast, ToastContainer } from "react-toastify";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");

  function clearForm() {
    setUsername("");
    setPassword("");
    setName("");
    setEmail("");
  }

  const {
    setUsername: setLoggedInUsername,
    setId,
    setEmailOfUser,
    setNameOfUser,
  } = useContext(UserContext);

  const guestLogin = async ()=>{
    await axios.post('/login',{
      username: 'guest',
      password: 'guest'
    }).then((res)=>{
      const { data } = res;
      
      setLoggedInUsername(data.username);
      setId(data.userId);
      setEmailOfUser(data.email);
      setNameOfUser(data.name);

      toast.success("Guest Login Successful");
    }).catch((err)=>{
      toast.error("Guest Login Failed", {
        position: "top-right",
        autoClose: 3000,
      });
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = isLoginOrRegister === "register" ? "/register" : "/login";
    const data = { username, password };
    if (isLoginOrRegister === "register") {
      data.name = name;
      data.email = email;
    }
    try {
      await axios
        .post(url, data, { withCredentials: true })
        .then((res) => {
          const { data } = res;
          console.log(data);
          setLoggedInUsername(data.username);
          setId(data.userId);
          setEmailOfUser(data.email);
          setNameOfUser(data.name);

          toast.success("Registration Successful");
        })
        .catch((err) => {
          toast.error(`Registration Failed ${err.response?.data.error}`, {
            position: "top-right",
            autoClose: 3000,
          });
        });
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("Registration failed");
    }
  }

  return (
    <div className="bg-blue-100 w-screen h-screen p-2 flex items-center justify-center overflow-hidden">
      <div className="absolute w-24 md:w-48 aspect-square rounded-full bg-[radial-gradient(circle,_#da4cd5,_#e28bb999)] translate-x-full shadow-2xl translate-y-full backdrop-blur-lg "></div>
      <div className="absolute w-36 md:w-48 aspect-square rounded-full bg-[radial-gradient(circle,_#a267d9,_#a586d588)] -translate-x-1/3 -translate-y-[8rem] backdrop-blur-lg"></div>
      <div className="absolute w-24 md:w-32 aspect-[4] rounded-full bg-[radial-gradient(circle,_#67d9c4,_#a586d588)] -translate-x-1/2 translate-y-[11rem] backdrop-blur-lg "></div>
      <button className="absolute right-0 top-0 m-2 rounded-xl bg-white/30 py-2 px-4 font-semibold text-lg shadow-2xl text-gray-500" onClick={guestLogin}>Login as Guest</button>
      <div className="w-full lg:w-1/3 md:w-2/3 m-2 md:h-2/3 h-5/6 flex flex-col justify-evenly items-center relative backdrop-blur-lg bg-white/30 border border-white/20 rounded-lg shadow-lg">
        {isLoginOrRegister === "register" ? (
          <div className=" text-4xl text-black drop-shadow-lg font-semibold">
            Sign Up
          </div>
        ) : (
          <div className="text-black drop-shadow-2xl font-mono text-4xl font-semibold">
            Login
          </div>
        )}

        <form className="w-[20rem] mx-auto" onSubmit={handleSubmit}>
          {isLoginOrRegister === "register" && (
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-sm p-2 m-2 border border-gray-300 bg-white/70 shadow-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-sm p-2 m-2 border border-gray-300 bg-white/70 shadow-lg"
              />
            </div>
          )}
          <input
            type="text"
            placeholder={`Username${
              isLoginOrRegister === "login" ? " / Email" : ""
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full rounded-sm p-2 m-2 border border-gray-300 bg-white/70 shadow-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-sm p-2 m-2 border border-gray-300 bg-white/70 shadow-lg"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md block w-full p-2 m-2 shadow-md"
          >
            {isLoginOrRegister === "register" ? "Register" : "Login"}
          </button>

          {isLoginOrRegister === "register" && (
            <div className="mt-2 text-center text-black text-bold">
              Already a Member?{" "}
              <button
                onClick={() => {
                  setIsLoginOrRegister("login");
                  clearForm();
                }}
                className="text-blue-300 underline"
              >
                Login Here
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div className="mt-2 text-center text-black text-bold">
              Don't have an Account?{" "}
              <button
                onClick={() => {
                  setIsLoginOrRegister("register");
                  clearForm();
                }}
                className="text-blue-300 underline"
              >
                Register Here
              </button>
            </div>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterAndLoginForm;
