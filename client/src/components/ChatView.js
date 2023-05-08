import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatArea from "./ChatArea";
import ChatForm from "./ChatForm";
import { ChatContext } from "../context/chatContext";


/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const {selectedConversationId, messagesContext,systemPromote} = useContext(ChatContext);
    const {dbData: messagesDbData , saveDataToDB: saveMessagesToDB} = messagesContext;

    const [messages, setMessages] = useState([]);
    const [thinking, setThinking] = useState(false)

    useEffect(() => {
      loadMessages();

    }, [selectedConversationId, messagesDbData])

    const loadMessages = () => {
        const withCVIdMessages = Array.from(messagesDbData.values())
          .filter((message) => {
              const isAIDefaultMessage = message.id === '10001';
              return isAIDefaultMessage || (message.conversationId && message.conversationId === selectedConversationId)
          })
        setMessages(withCVIdMessages);
    }


    const addMessage = async (message) => {
        const id = message?.messageID || undefined;
        await saveMessagesToDB({...message, id, conversationId: selectedConversationId});
    }



    return (
        <div className="chatview">
            <main className='chatview__chatarea'>
                <ChatArea messages={messages} thinking={thinking}/>
                <ChatForm
                    addMessage={addMessage}
                    setThinking={setThinking}
                />
            </main>
        </div>
    )
}

export default ChatView