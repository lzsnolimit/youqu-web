import React, {useContext, useEffect, useRef, useState} from 'react';
import ChatMessage from './ChatMessage';
import Thinking from './Thinking';
import {ChatContext} from "../context/chatContext";

const ChatArea = ({ messagesDbData, thinking }) => {

    const messagesEndRef = useRef()

    const {selectedConversationId} = useContext(ChatContext);

    const [messages, setMessages] = useState([]);

    const loadMessages = () => {
        const withCVIdMessages = Array.from(messagesDbData.values())
            .filter((message) => {
                const isAIDefaultMessage = message.id === '10001';
                return isAIDefaultMessage || (message.conversationId && message.conversationId === selectedConversationId);
            });
        setMessages(withCVIdMessages);
    };

    useEffect(() => {
        loadMessages();
    }, [messagesDbData, selectedConversationId]);

    /**
     * Scrolls the chat area to the bottom.
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    /**
     * Scrolls the chat area to the bottom when the messages array is updated.
     */
    useEffect(() => {
        //console.log("Messages size:"+messages.size)
        scrollToBottom()
    }, [messages])


    return (

    <div className='message-box'>
        {messages.map((message) => (
            <ChatMessage key={message.messageID} message={{...message}} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
    </div>)
};

export default ChatArea;