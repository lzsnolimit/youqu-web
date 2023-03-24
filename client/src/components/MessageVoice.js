import React from 'react'

/**
 * A component that displays an audio player for the given binary audio content.
 *
 * @param binaryContent - The binary content of the audio file to play.
 * @returns {JSX.Element} - A JSX element representing the audio player.
 */
const MessageVoice = ({ audioContent }) => {
    // Convert binary content to base64 and create a data URL for the audio file
    //const audioDataURL = `data:audio/*;base64,${btoa(audioContent)}`;

    //const result=audioContent.result;
    const audioBase64 = audioContent.audio_data;
// 将 Base64 编码的音频数据转换为 Uint8Array
    const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));

// 创建 Blob 对象，其中包含音频数据，并设置其内容类型
    const audioBlob = new Blob([audioBytes], { type: 'audio/wav' });

// 创建 Audio 对象，并设置其来源为音频 Blob
    const audio = URL.createObjectURL(audioBlob);

    // Render an audio element with controls and the data URL as the source
    return (
        <div className="message__wrapper">
        <audio controls src={audio} />
        </div>
    )
}
export default MessageVoice;