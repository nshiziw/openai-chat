"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { ScrollArea } from "./components/ui/scroll-area.jsx";

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        isSent: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      // Simulate a received message
      setTimeout(() => {
        const receivedMessage = {
          id: Date.now(),
          text: "Thanks for your message!",
          isSent: false,
        };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }, 1000);
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
                      : "bg-white text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
