import React, {useContext, useEffect, useState} from 'react'
import {ChatContext} from '../context/chatContext'
import {createStore, set} from 'idb-keyval';
import ChatArea from "./ChatArea";
import ChatForm from "./ChatForm";
import store from '../common/storage'
import useMessageCollection from "../hooks/useMessageCollection";
/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const [thinking, setThinking] = useState(false)
    const [messages, setMessages, clearMessages] = useMessageCollection([])

    const addMessage = (message) => {
        //console.log("Message:"+JSON.stringify(message))
        const updatedMessages = new Map(messages);
        updatedMessages.set(message.messageID, message);
        setMessages(pre => new Map([...pre, ...updatedMessages]));
    };


    return (
        <div className="chatview">
            <main className='chatview__chatarea'>
                <ChatArea messages={messages} thinking={thinking}/>
                <ChatForm
                    addMessage={addMessage}
                    messages={messages}
                    setThinking={setThinking}
                />
            </main>
        </div>
    )
}

export default ChatView