import axios from 'axios';
import { UserProvider } from './components/UserContext';
import Routes from './Routes';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  axios.defaults.baseURL = 'https://buzz-chat-nu.vercel.app/';
  axios.defaults.withCredentials = true;

  return (
    <UserProvider>  
      <Routes/>
    </UserProvider>
  );
}

export default App;
