import { MessageCircle, User,Bot } from "lucide-react";

const ChatMessage = ({ chat }) => {
  const isBot = chat.role === "model";

  return (
    <>
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
            <div className="botIcon">
            <Bot size={22} color="black" />
            </div>
        )}
        </div>
    </>
  );
};

export default ChatMessage;