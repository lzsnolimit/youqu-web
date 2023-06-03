import React, {useContext} from 'react';
import {MdCancel, MdComputer, MdOutlineCancel, MdPersonOutline} from 'react-icons/md';
import {MESSAGE_TYPE} from "../common/constant";
import MessagePicture from "./MessagePicture";
import MessageVoice from "./MessageVoice";
import MessageText from "./MessageText";
import {ChatContext} from "../context/chatContext";

const ChatMessage = (props) => {
    const { messageID, createdAt, content: content, ai = false, type } = props.message;
    const { showStop = false } = props;
    const {user,sendMessage} = useContext(ChatContext);

    const renderMessageContent = () => {
        switch (type) {
            // case MESSAGE_TYPE.INTRODUCTION:
            //     return <MessageText ai={ai} content={content} createdAt={createdAt}/>;
            case MESSAGE_TYPE.PICTURE:
                return <MessagePicture ai={ai} b64Content={content} createdAt={createdAt}/>;
            //data:image/png;base64,
            case MESSAGE_TYPE.AUDIO:
                return <MessageVoice ai={ai} audioContent={content} createdAt={createdAt}/>;
            case MESSAGE_TYPE.TEXT:
            default:
                return <MessageText ai={ai} content={content} createdAt={createdAt}/>;
        }
    }

    const stop= async () => {
        console.log('stop')
        sendMessage('stop', {});
    }

    const handleStopClick = () => {
        // if (typeof setRendering === 'function') {
        //     //setRendering(false);
        // }
    }

    return (
        <div key={messageID} className={`${ai && 'flex-row-reverse'} message`}>

            {renderMessageContent()}
            <div className="message__pic">
                {showStop&&ai?(<button onClick={stop} className="bg-transparent border-none">
                    <MdComputer />
                    stop
                </button>):(< MdPersonOutline/> )}
            </div>
        </div>
    )
}

export default ChatMessage;