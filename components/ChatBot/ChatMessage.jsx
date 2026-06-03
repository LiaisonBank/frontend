import {
  MessageCircle,
} from "lucide-react";

const chatMessage = ({ chat }) => {

    return (   
        <div className={`message-${chat.role === 'model' ? 'bot' : 'user'}-message`}>
            {chat.role === 'model' &&  <div className="botIcon"> <MessageCircle size={22} /> </div> }
            <div className="messageText">
                {chat.text}
            </div>
        </div>
    )
};

export default chatMessage;