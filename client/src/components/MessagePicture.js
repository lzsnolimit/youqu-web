import React from 'react'
import moment from "moment";

/**
 * A component that displays an audio player for the given binary audio content.
 *
 * @param binaryContent - The binary content of the audio file to play.
 * @returns {JSX.Element} - A JSX element representing the audio player.
 */
const MessagePicture = ({ai, b64Content, createdAt}) => {

    const pictureBase64 = b64Content;

    const pictureSrc = "data:image/png;base64, " + pictureBase64;

    // Render an audio element with controls and the data URL as the source
    return (
        <div className={`message__wrapper ${ai ? 'message__wrapper__left' : 'message__wrapper__right'}`}>
            <img className='message__img' src={pictureSrc} alt='DALL·E 2 generated' loading='lazy'/>
            <div
                className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>{moment(createdAt).fromNow()}
            </div>
        </div>
    )
}
export default MessagePicture;