"use client";
import { useState } from "react";
import ChatBot from "@/components/ChatBot/ChatBot";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleChatFormSubmit = (e) => {
    e.preventDefault();

    console.log("Message:", message);

    // API Call
    // Socket Event
    // State Update

    setMessage("");
  };
  return (
    <>
     <ChatBot onSubmitForm={handleChatFormSubmit} />
    </>
  );
}