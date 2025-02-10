/* eslint-disable react/prop-types */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Title Section */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-center text-sky-800">{title}</h1>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-grow p-4">
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
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isSent
                      ? "bg-blue-500 text-white"
                      : "bg-sky-100 shadow text-sky-700"
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
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your prompt here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full focus:ring focus:ring-sky-400 border rounded-md transition-all duration-300 px-2 border-sky-400"
          />
          <Button className="bg-sky-600 hover:bg-sky-400 transition-all duration-500" type="submit">Send Prompt</Button>
        </form>
      </div>
    </div>
  );
}
