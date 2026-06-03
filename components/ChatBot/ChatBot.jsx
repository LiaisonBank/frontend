"use client";

import { useState } from "react";
import {
  ChevronDown,
  X,
  MessageCircle,
} from "lucide-react";

import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

export default function ChatBot() {
  const [chatHistory, setChatHistory] = useState([]);

  // Default Closed
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        className="chatToggle"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} />
        )}
      </button>

      {/* CHAT CONTAINER */}
      <div
        className={`chatContainer ${
          !open ? "hide" : ""
        }`}
      >
        {/* HEADER */}
        <div className="chatHeader">
          <div className="headerLeft">
            <div className="botIcon">
              <MessageCircle size={22} />
            </div>

            <h2>Chatbot</h2>
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