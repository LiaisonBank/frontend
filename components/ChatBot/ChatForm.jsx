import { useRef } from "react";
import {
    SendHorizontal,
} from "lucide-react";

const ChatForm = ({ setChatHistory }) => {
    const inputRef = useRef(null);

   const handleChatFormSubmit = (e) => {
    e.preventDefault();

    // Get input value
    const userMessage = inputRef.current.value.trim();

    if (!userMessage) return;

    console.log("User Input:", userMessage);

    // Add user message
    setChatHistory((prev) => [
        ...prev,
        { role: "user", text: userMessage }
    ]);

    // Clear input field
    inputRef.current.value = "";

    // Bot thinking message
    setTimeout(() => {
        setChatHistory((prev) => [
            ...prev,
            { role: "model", text: "Thinking..." }
        ]);
    }, 1000);
};
    return (
        <>
            <div className="inputArea">
                <form action="#" className="chatForm" onSubmit={handleChatFormSubmit}>
                    <div className="inputArea">
                        <input
                            type="text"
                            placeholder="Message..."
                            ref={inputRef}
                        />

                        <button className="sendBtn">
                            <SendHorizontal size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default ChatForm;