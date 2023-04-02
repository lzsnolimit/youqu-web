import React, {useContext, useState} from 'react'
import {ChatContext} from '../context/chatContext'
import {createStore, set} from 'idb-keyval';
import ChatArea from "./ChatArea";
import ChatForm from "./ChatForm";

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const [thinking, setThinking] = useState(false)
    const [messages, addMessage] = useContext(ChatContext)



    const store = new createStore("youqu.app", "messages");

    const saveMessage=(newMsg)=>{
        set(Date.now(), newMsg, store)
            .then(() => {
                console.log("Message saved to indexedDB");
            })
            .catch((error) => {
                console.error("Error updating message in indexedDB:", error);
            });
    }



    return (
        <div className="chatview">
            <ChatArea messages={messages} thinking={thinking} addMessage={addMessage}/>
            <ChatForm
                addMessage={addMessage}
                setThinking={setThinking}
                saveMessage={saveMessage}
            />
        </div>
    )
}

export default ChatView