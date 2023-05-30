import React, {useContext, useEffect, useRef, useState} from 'react';
import ChatMessage from './ChatMessage';
import Thinking from './Thinking';
import {ChatContext} from "../context/chatContext";

const ChatHistoryArea = ({ messagesDbData }) => {


    const {currentConversation} = useContext(ChatContext);

    const [messages, setMessages] = useState([]);


    const loadMessages = () => {
        const withConveresationIdMessages = Array.from(messagesDbData.values())
            .filter((message) => {
                const isAIDefaultMessage = message.id === '10001';
                return isAIDefaultMessage || (message.conversationId && message.conversationId === currentConversation.id);
            });
        setMessages(withConveresationIdMessages);
    };

    useEffect(() => {
        loadMessages();
    }, [messagesDbData, currentConversation]);

    /**
     * Scrolls the chat area to the bottom.
     */

    function safeRender(message) {
        try {
            return <ChatMessage key={message.messageID} message={{...message}} />;
        } catch (error) {
            console.error('Error rendering message:', error);
            return null;
        }
    }

    return (

    <>
        {console.log("rendering ChatHistoryArea")}
        {messages.map((message) => (
            safeRender(message)
        ))}
    </>)
};

export default ChatHistoryArea;