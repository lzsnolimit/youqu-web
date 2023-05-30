import React, {useContext, useEffect, useRef, useState} from 'react'
import ChatHistoryArea from "./ChatHistoryArea";
import ChatForm from "./ChatForm";
import {messagesStore} from "../common/storage";
import {initialMsg} from "../common/constant";
import useIndexedDB from "../hooks/useIndexedDB";
import ChatNewMessage from "./ChatNewMessage";
import {ChatContext} from "../context/chatContext";
import ErrorBoundary from "../common/ErrorBoundary";

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const messagesContext = useIndexedDB(messagesStore, initialMsg);
    const {dbData: messagesDbData , saveDataToDB: saveMessagesToDB} = messagesContext
    const [thinking, setThinking] = useState(false)
    const [newReplyMessage,setNewReplyMessage] = useState(false)
    const messagesEndRef = useRef()
    const {currentConversation} = useContext(ChatContext);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    /**
     * Scrolls the chat area to the bottom when the messages array is updated.
     */
    useEffect(() => {
        scrollToBottom()
    }, [messagesDbData, currentConversation,thinking])


    return (
        <div className="chatview">
            <ErrorBoundary key={currentConversation.id}>
            <main className='chatview__chatarea'>
                <div className='message-box'>
                <ChatHistoryArea
                    messagesDbData={messagesDbData}
                />
                <ChatNewMessage setThinking={setThinking} scrollToBottom={scrollToBottom} saveMessagesToDB={saveMessagesToDB} newReplyMessage={newReplyMessage} setNewReplyMessage={setNewReplyMessage}
                />
                <span ref={messagesEndRef}></span>
                </div>
                {console.log("Start chatview")}
                <ChatForm
                    saveMessagesToDB={saveMessagesToDB}
                    setThinking={setThinking}
                    thinking={thinking}
                    setNewReplyMessage={setNewReplyMessage}
                />
            </main>
            </ErrorBoundary>
        </div>
    )
}

export default ChatView