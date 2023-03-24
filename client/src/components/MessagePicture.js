import React from 'react'

/**
 * A component that displays an audio player for the given binary audio content.
 *
 * @param binaryContent - The binary content of the audio file to play.
 * @returns {JSX.Element} - A JSX element representing the audio player.
 */
const MessagePicture = ({ b64Content }) => {

    const pictureBase64 = b64Content.picture_data;

    const pictureSrc = "data:image/png;base64, "+pictureBase64;

    // Render an audio element with controls and the data URL as the source
    return (
        <div className="message__wrapper">
            <img className='message__img' src={pictureSrc} alt='DALL·E 2 generated' loading='lazy' />
        </div>
    )
}
export default MessagePicture;