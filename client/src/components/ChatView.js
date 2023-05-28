import React, {useContext, useEffect, useState} from 'react'
import ChatArea from "./ChatArea";
import ChatForm from "./ChatForm";
import {ChatContext} from "../context/chatContext";
import {messagesStore} from "../common/storage";
import {initialMsg} from "../common/constant";
import useIndexedDB from "../hooks/useIndexedDB";

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const messagesContext = useIndexedDB(messagesStore, initialMsg);
    const {dbData: messagesDbData , saveDataToDB: saveMessagesToDB} = messagesContext
    const [thinking, setThinking] = useState(false)

    return (
        <div className="chatview">
            <main className='chatview__chatarea'>
                <ChatArea
                    messagesDbData={messagesDbData}
                    thinking={thinking}
                />
                {console.log("Start chatview")}
                <ChatForm
                    saveMessagesToDB={saveMessagesToDB}
                    setThinking={setThinking}
                />
            </main>
        </div>
    )
}

export default ChatView