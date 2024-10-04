import RegisterAndLoginForm from "./components/RegisterAndLoginForm";
import Chat from "./components/Chat";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "./components/UserContext";

const Routes = () => {
  const token = Cookies.get("token"); 
  const {username} = useContext(UserContext);
  if (token && username) {
    return <Chat />;
  }
  return <RegisterAndLoginForm />;
};

export default Routes;