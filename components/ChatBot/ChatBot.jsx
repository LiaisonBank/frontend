"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "lenis/react"; // or however you're accessing Lenis
import Image from "next/image";
import WhatsAppIcon from "./WhatsAppIcon";
import { ChevronDown, X } from "lucide-react";
import logo from "../../assets/images/company/logo.png";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

export default function ChatBot() {
  const [isMobile, setIsMobile] = useState(false);
  const [ischatOpen, setIschatOpen] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clear chat history
  const clearChatHistory = () => {
    setChatHistory([]);

    // Remove persisted chat (if you're using localStorage)
    localStorage.removeItem("chatHistory");

    // Optional: close the chat
    // setOpen(false);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        className={isMobile ? "row" : "chatToggle"}
        onClick={() => setIschatOpen(!ischatOpen)}
      >
        {ischatOpen ? (
          <X size={28} />
        ) : (
          <WhatsAppIcon size={40} color="#ffffff" />
        )}
      </button>

      {/* CHAT CONTAINER */}
      <div className={`chatContainer ${!ischatOpen ? "hide" : ""}`}>
        {/* HEADER */}
        <div className="chatHeader">
          <div className="headerLeft">
            <div className="botIcon">
              <Image
                src={logo}
                alt="Logo"
                width={150}
                height={50}
                onClick={clearChatHistory}
                style={{ cursor: "pointer" }}
              />
            </div>

            <h4>Liaison Bank</h4>
          </div>
          <div className="header-action d-flex align-itmes-center gap-2">                                   
            {/* New Chat */}
            <button
              className="minimize text-black"
              onClick={clearChatHistory}
            >
            <Image
              src="/images/refresh.png"
              alt="Refresh"
              width={16}
              height={16}
              onClick={clearChatHistory}
              style={{ cursor: "pointer" }}
            />
            </button>

            {/* Minimize */}
            <button
              className="minimize"
              onClick={() => setOpen(false)}
            >
              <ChevronDown color="black" size={24} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="chatBody" >
          {chatHistory.map((chat, index) => (
            <ChatMessage
              key={index}
              chat={chat}
              ref={chatRef}
              clearChatHistory={clearChatHistory}
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