import React from 'react';
import moment from "moment";

const MessageIntroduction = ({ai, content, createdAt}) => {


    return (
        <div className={`message__wrapper ${ai ? 'message__wrapper__left' : 'message__wrapper__right'}`}>
            <div>
                {content.hasOwnProperty("result") ? content.result : content}
            </div>
            <div>
                className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>{moment(createdAt).fromNow()}
            </div>
        </div>

    );
};

export default MessageIntroduction