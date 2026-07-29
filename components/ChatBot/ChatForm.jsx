import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

const ChatForm = ({ setChatHistory }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleChatFormSubmit = async (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();

    if (!userMessage || loading) return;

    // Show user message immediately
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
        "https://liaisonbank.frappe.cloud/api/method/frappe_whatsapp.utils.webhook.webhook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          text:
            data.message ||
            data.response ||
            data.data ||
            "Message received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          text: "Unable to connect to ERP chatbot.",
        },
      ]);
    } finally {
      setLoading(false);
    }
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
          type="submit"
          className="sendBtn"
          disabled={loading}
        >
          {loading ? (
            <span className="loadingDots"></span>
          ) : (
            <SendHorizontal size={18} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatForm;