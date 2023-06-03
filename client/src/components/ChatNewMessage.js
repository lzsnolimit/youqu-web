import React, {useContext, useEffect, useRef, useState} from 'react';
import ChatMessage from './ChatMessage';
import Thinking from './Thinking';
import {ChatContext} from "../context/chatContext";
import {MESSAGE_TYPE} from "../common/constant";

const ChatNewMessage = ({ scrollToBottom,setThinking,setNewReplyMessage,newReplyMessage,saveMessagesToDB }) => {
    const {currentConversation,socketRef} = useContext(ChatContext);
    const [displayMessage, setDisplayMessage] = useState(null);
    // const [showStop, setShowStop] = useState(true);

    useEffect(() => {
        if (!socketRef.current) {
            console.log('socket.current is null')
            return;
        }

        console.log('socket.current is not null')

        socketRef.current.on('reply', function (data) {
            //console.log('reply' + JSON.stringify(data))
            appendStreamMessage(data,false)
            scrollToBottom()
        });

        socketRef.current.on('final', function (data) {
            console.log('final' + JSON.stringify(data))
            appendStreamMessage(data,true)
            setNewReplyMessage(null);
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
        }
    }   , [newReplyMessage]);

    const appendStreamMessage = (messageContent,isFinal=false) => {
        const message = {
            createdAt: Date.now(),
            ai: true,
            type: messageContent.response_type,
            messageID: messageContent.messageID,
            content: messageContent.content,
            conversationId: messageContent.conversation_id,
        };
        setDisplayMessage(message);
        if (isFinal){
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
            conversationId: message.conversationId ? message.conversationId : currentConversation.id,
        });
    };




    return (
        <>
        {displayMessage ?<ChatMessage showStop={true}  key={displayMessage.messageID} message={displayMessage} />: null}
        </>
   )
};

export default ChatNewMessage;