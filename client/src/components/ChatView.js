import React, {useState} from 'react'
import ChatArea from "./ChatArea";
import ChatForm from "./ChatForm";
import { messagesStore } from '../common/storage'
import useIndexedDB from "../hooks/useIndexedDB";
import { ulid } from "ulid";
import { MESSAGE_TYPE } from "../common/constant";

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const [thinking, setThinking] = useState(false)


    const initialMsg = {
        createdAt: Date.now(),
        messageID:ulid(),
        content: '你好，我是话痨机器人，有什么问题你可以直接问我。另外你还可以发送"#菜单"查看我支持的指令。',
        ai: true,
        type: MESSAGE_TYPE.INTRODUCTION,
    };


    // todo 1. 向SideBar拿到conversationID并且将其set给message
    const {dbData , saveDataToDB} = useIndexedDB(messagesStore, initialMsg);

    const addMessage = (message) => {
        saveDataToDB(message)
    }



    return (
        <div className="chatview">
            <main className='chatview__chatarea'>
                <ChatArea messages={dbData} thinking={thinking}/>
                <ChatForm
                    addMessage={addMessage}
                    messages={dbData}
                    setThinking={setThinking}
                />
            </main>
        </div>
    )
}

export default ChatView