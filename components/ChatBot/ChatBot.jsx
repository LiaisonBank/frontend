"use client";

import { useState, useEffect } from "react";
import WhatsAppIcon from "./WhatsAppIcon"
import {
  ChevronDown,
  X,
  Bot,
} from "lucide-react";

import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

export default function ChatBot() {
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Default Closed
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        className={isMobile ? "row" : "chatToggle"}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X size={28} />
        ) : (
          <WhatsAppIcon size={40} color="#ffffff" />

        )}
      </button>

      {/* CHAT CONTAINER */}
      <div
        className={`chatContainer ${!open ? "hide" : ""
          }`}
      >
        {/* HEADER */}
        <div className="chatHeader">
          <div className="headerLeft">
            <div className="botIcon">
              <Bot size={42} color="white" />
            </div>

            <h2>Let's Chat</h2>
          </div>

          <button
            className="minimize"
            onClick={() => setOpen(false)}
          >
            <ChevronDown size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="chatBody">
          {chatHistory.map((chat, index) => (
            <ChatMessage
              key={index}
              chat={chat}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="chatFooter">
          <ChatForm
            setChatHistory={setChatHistory}
          />
        </div>
      </div>
    </>
  );
}