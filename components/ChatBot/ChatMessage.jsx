import { User } from "lucide-react";
import Image from "next/image";
import logo from "../../assets/images/company/logo.png";

const ChatMessage = ({ chat, clearChatHistory }) => {
  const isBot = chat.role === "model";

  return (
    <div
      className={`chat-message ${isBot ? "bot-message" : "user-message"}`}
    >
      {!isBot && (
        <div className="userIcon">
          <User size={22} color="black" />
        </div>
      )}

      <div className="messageText">{chat.text}</div>

      {isBot && (
        <div className="icon">
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            onClick={clearChatHistory}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;