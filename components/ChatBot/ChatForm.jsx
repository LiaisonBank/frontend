import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

const ChatForm = ({ setChatHistory }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleChatFormSubmit = async (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();

    if (!userMessage || loading) return;

    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    inputRef.current.value = "";
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/meta/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: "919876543210",
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          text: data.message || "Message Sent",
        },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          text: "Unable to send message.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <form className="chatForm" onSubmit={handleChatFormSubmit}>
      <div className="inputArea">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          disabled={loading}
        />

        <button
          className="sendBtn"
          disabled={loading}
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </form>
  );
};

export default ChatForm;