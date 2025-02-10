/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatUI({ title }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef(null); // 👈 Reference the last message directly
  const API_URL = "http://localhost:5000/api/process";
  const inputRef = useRef(null);
  const [isInputEmpty, setIsInputEmpty] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if input is empty

    if (!inputValue.trim()) {
      setIsInputEmpty(true);
      setTimeout(() => {
        setIsInputEmpty(false);
      }, 5000)
      return;
    }
    setIsInputEmpty(false);

    setIsLoading(true);

    // Generate unique ID for the user message
    const userMessageId = Date.now();

    // Create user message
    const newMessage = {
      id: userMessageId,
      text: inputValue,
      isSent: true,
    };

    // Create loading message
    const loadingMessage = {
      id: userMessageId + 1, // Ensure unique ID
      text: "Loading...",
      isSent: false,
    };

    // Add both messages in one state update
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
      loadingMessage,
    ]);
    setInputValue(""); // Clear input after sending

    try {
      const sendMessage = await axios.post(
        API_URL,
        { prompt: inputValue },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the loading message with the actual response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id // Ensure correct match
            ? { ...msg, text: sendMessage.data.Message }
            : msg
        )
      );
    } catch (err) {
      console.error("Error sending message", err);
      toast.error("Failed to send message");

      // Update the loading message with an error message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, text: "Failed to load response" }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to scroll to the last message
  const scrollToBottom = () => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Small delay to ensure the new message is rendered
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 👈 Scroll when messages change

  return (
    <div className="flex flex-col h-screen bg-[#212121] gap-2">
      {/* Title Section */}
      <div className="bg-[#303030] rounded-b-xl p-4">
        <h1 className="text-2xl font-bold text-center text-sky-100">{title}</h1>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-grow p-4 bg-[#212121] rounded-lg">
        <div ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={`flex ${
                  message.isSent ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] font-light py-3 px-5 ${
                    message.isSent
                      ? "bg-transparent text-[#eeeeee]"
                      : "bg-[#303030] rounded-lg text-[#eeeeee]"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="bg-[#303030] p-4 rounded-t-lg">
        <form onSubmit={handleSubmit} className="flex space-x-2 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your prompt here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full text-sm py-2 font-light bg-transparent text-[#eeeeee] focus:ring-1 focus:ring-[#212121] border rounded-md transition-all duration-300 px-2 border-none"
          />
          {isInputEmpty && (
            <p className="absolute right-0 -top-10 text-rose-400 text-sm">Prompt can&apos;t be empty</p>
          )}
          <button
            disabled={isLoading}
            className={`text-2xl group text-white bg-transparent transition-all duration-500 ${
              isLoading ? "opacity-40 cursor-not-allowed" : ""
            }`}
            type="submit"
          >
            <IoIosSend className="text-3xl group-hover:scale-125 group-hover:text-gray-400 transition-all duration-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
