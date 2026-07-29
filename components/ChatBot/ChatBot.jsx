"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import WhatsAppIcon from "./WhatsAppIcon";
import { ChevronDown, X } from "lucide-react";
import logo from "../../assets/images/company/logo.png";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

export default function ChatBot() {
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Default Closed
  const [open, setOpen] = useState(false);

  const chatBodyRef = useRef(null);

useEffect(() => {
  const el = chatBodyRef.current;
  if (!el) return;

  const handleWheel = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = el;

    const scrollingDown = e.deltaY > 0;
    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (
      (scrollingDown && !atBottom) ||
      (!scrollingDown && !atTop)
    ) {
      e.stopPropagation();
    }

    e.preventDefault();
  };

  el.addEventListener("wheel", handleWheel, { passive: false });

  return () => {
    el.removeEventListener("wheel", handleWheel);
  };
}, []);

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
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X size={28} />
        ) : (
          <WhatsAppIcon size={40} color="#ffffff" />
        )}
      </button>

      {/* CHAT CONTAINER */}
      <div className={`chatContainer ${!open ? "hide" : ""}`}>
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
        <div className="chatBody" ref={chatBodyRef}>
          {chatHistory.map((chat, index) => (
            <ChatMessage
              key={index}
              chat={chat}
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