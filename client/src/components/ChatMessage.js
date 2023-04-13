import React from 'react'
import {MdComputer, MdPersonOutline} from 'react-icons/md'
import MessageText from "./MessageText";
import MessageVoice from "./MessageVoice";
import MessagePicture from "./MessagePicture";
import {MESSAGE_TYPE} from '../common/constant';


/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
    const {messageID, createdAt, content: content, ai = false, type} = props.message

    // 根据消息类型选择合适的组件进行渲染（图片、语音或文本）
    const renderMessageContent = () => {
        switch (type) {
            case MESSAGE_TYPE.INTRODUCTION:
                return <MessageText ai={ai} content={content} createdAt={createdAt}/>;
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

    return (
        <div key={messageID} className={`${ai && 'flex-row-reverse'} message`}>
           {/*{console.log("messageID:"+messageID)}*/}
           {/*{console.log("content:"+content)}*/}
            {renderMessageContent()}
            <div className="message__pic">
                {
                    ai ? <MdComputer/> : <MdPersonOutline/>
                }
            </div>
        </div>
    )
}

export default ChatMessage