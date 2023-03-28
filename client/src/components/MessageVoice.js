import React from 'react'

/**
 * A component that displays an audio player for the given binary audio content.
 *
 * @param binaryContent - The binary content of the audio file to play.
 * @returns {JSX.Element} - A JSX element representing the audio player.
 */
const MessageVoice = ({audioContent}) => {
    // Convert binary content to base64 and create a data URL for the audio file
    //const audioDataURL = `data:audio/*;base64,${btoa(audioContent)}`;

    //const result=audioContent.result;
    const audioBase64 = audioContent.audio_data;


    const audioSrcContent = `data:audio/wav;base64,${audioBase64}`;
    //console.log(audioSrcContent)
    // Render an audio element with controls and the data URL as the source
    return (
        <div className="message__wrapper">
            <audio controls src={audioSrcContent}/>
        </div>
    )
}
export default MessageVoice;