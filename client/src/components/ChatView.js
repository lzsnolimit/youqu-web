import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatArea from "./ChatArea";
import ChatForm from "./ChatForm";
import { messagesStore } from '../common/storage'
import useIndexedDB from "../hooks/useIndexedDB";
import { ulid } from "ulid";
import { MESSAGE_TYPE } from "../common/constant";
import { ChatContext } from "../context/chatContext";


const initialMsg = {
    id: '10001',
    createdAt: Date.now(),
    messageID:ulid(),
    content: '你好，我是话痨机器人，有什么问题你可以直接问我。另外你还可以发送"#菜单"查看我支持的指令。',
    ai: true,
    type: MESSAGE_TYPE.INTRODUCTION,
};
/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const {dbData: messagesDbData , saveDataToDB: saveMessagesToDB} = useIndexedDB(messagesStore, initialMsg);
    const {selectedConversationId} = useContext(ChatContext);

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