/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatUI({ title }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef(null);
  const API_URL = "http://localhost:5000/api/process";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if input is empty
    if (!inputValue.trim()) {
      toast.error("Prompt is required");
      return;
    }

    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        isSent: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      try {
        const sendMessage = await axios.post(API_URL, { prompt: inputValue }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const receivedMessage = {
          id: Date.now(),
          text: sendMessage.data.Message,
          isSent: false,
        };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (err) {
        console.error("Error sending message", err);
        toast.error("Failed to send message");
      }
    }
  };

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const lastMessage = scrollAreaRef.current.lastElementChild;
      lastMessage?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 gap-2">
      {/* Title Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-center text-sky-800">{title}</h1>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-grow p-4 bg-[#003554] rounded-lg">
        <div ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isSent ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] font-light py-3 px-5 ${
                    message.isSent
                      ? "bg-transparent text-[#eeeeee]"
                      : "bg-[#00395B] rounded-lg text-[#eeeeee]"
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
      <div className="bg-[#003554] p-4 rounded-md">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your prompt here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full text-sm font-light bg-transparent text-[#eeeeee] focus:ring-1 focus:ring-sky-900 border rounded-md transition-all duration-300 px-2 border-none"
          />
          <Button
            className=" text-2xl hover:text-sky-400 bg-transparent hover:bg-sky-900 transition-all duration-500"
            type="submit"
          >
            <IoIosSend className="text-2xl" />
          </Button>
        </form>
      </div>
    </div>
  );
}
