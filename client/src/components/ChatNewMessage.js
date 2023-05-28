import React, {useContext, useEffect, useRef, useState} from 'react';
import ChatMessage from './ChatMessage';
import Thinking from './Thinking';
import {ChatContext} from "../context/chatContext";
import {MESSAGE_TYPE} from "../common/constant";

const ChatNewMessage = ({ scrollToBottom,setThinking,setNewReplyMessage,newReplyMessage,saveMessagesToDB }) => {
    const messagesEndRef = useRef()
    const {selectedConversationId,socketRef} = useContext(ChatContext);
    const [displayMessage, setDisplayMessage] = useState(null);


    useEffect(() => {
        if (!socketRef.current) {
            console.log('socket.current is null')
            return;
        }

        console.log('socket.current is not null')

        socketRef.current.on('reply', function (data) {
            console.log('reply' + JSON.stringify(data))
            appendStreamMessage(data,false)
            scrollToBottom()
        });

        socketRef.current.on('final', function (data) {
            console.log('final' + JSON.stringify(data))
            appendStreamMessage(data,true)
            scrollToBottom()
        });

        socketRef.current.on('disconnect', function (data) {
            console.log('disconnect')
        });
    }, [socketRef.current]);

    useEffect(() => {
        if (newReplyMessage!= null) {
            setDisplayMessage(newReplyMessage);
            //addMessageInDB(newReplyMessage)
            setNewReplyMessage(null);
        }
    }   , [newReplyMessage,setNewReplyMessage]);

    const appendStreamMessage = (messageContent,isFinal=false) => {
        const message = {
            createdAt: Date.now(),
            ai: true,
            type: MESSAGE_TYPE.TEXT,
            messageID: messageContent.messageID,
            content: messageContent.content,
            conversationId: messageContent.conversation_id,
        };
        setDisplayMessage(message);
        if (isFinal){
            setThinking(false);
            addMessageInDB(message).then(r => {
                setDisplayMessage(null);
            })
        }
    };

    const addMessageInDB = async (message) => {
        const id = message?.messageID || undefined;
        await saveMessagesToDB({
            ...message,
            id,
            conversationId: message.conversationId ? message.conversationId : selectedConversationId,
        });
    };




    return (
        <>
        {displayMessage ?<ChatMessage key={displayMessage.messageID} message={displayMessage} />: null}
        </>
   )
};

export default ChatNewMessage;