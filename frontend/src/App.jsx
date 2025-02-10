import ChatUI from "./ChatUI"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <div>
      <ToastContainer position="top-right" />
      <section className="w-screen h-screen bg-[#212121] px-[10%]">
        <ChatUI title="AI Text Processor" />
      </section>
    </div>
  );
}

export default App