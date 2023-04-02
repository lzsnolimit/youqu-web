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
        scrollToBottom()
    }, [messages, thinking])

    return (
    <main className='chatview__chatarea'>
        {messages.map((message, index) => (
            <ChatMessage key={index} message={{...message}} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
    </main>)
};

export default ChatArea;