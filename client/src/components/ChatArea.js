import React, {useEffect, useRef} from 'react';
import ChatMessage from './ChatMessage';
import Thinking from './Thinking';

const ChatArea = ({ messages, thinking }) => {

    const messagesEndRef = useRef()

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