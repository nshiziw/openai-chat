import ChatUI from "./ChatUI"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <div>
      <ToastContainer
      position="top-right"/>
      <ChatUI title="AI Text Processor" />
    </div>
  )
}

export default App