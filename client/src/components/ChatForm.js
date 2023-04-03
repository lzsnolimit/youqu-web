import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, Row, Col} from 'antd';
import {API_PATH, COMMANDS, MESSAGE_TYPE} from "../common/constant";
import {useCookies} from "react-cookie";


const ChatForm = ({addMessage,setThinking,saveMessage}) => {

    const [cookies] = useCookies(['id', 'Authorization']);
    const [requestSelected, setRequestSelected] = useState(API_PATH.TEXT)
    const [responseSelected, setResponseSelected] = useState(MESSAGE_TYPE.TEXT)
    const [message, setMessage] = useState("")
    const fileInputRef = useRef(null);
    const inputRef = useRef()


    /**
     * Focuses the TextArea input to when the component is first rendered.
     */
    useEffect(() => {
        inputRef.current.focus()
    }, [])

    const sendCommand = async (messageContent, api_path, file = null) => {

        const POST_URL = process.env.REACT_APP_BASE_URL + api_path

        setThinking(true)
        const formData = new FormData();
        formData.append("msg", messageContent);
        if (file) {
            formData.append("files", file);
        }
        formData.append("id", cookies.id);
        const response = await fetch(POST_URL, {
            method: 'POST',
            timeout: 600000,
            headers: {
                "dataType": "json",
            },
            body: formData, // 使用 formData 作为 body
            credentials: 'include'
        })

        await processReplyMessage(response, MESSAGE_TYPE.TEXT)
    }




    const sendMessage = async (messageContent) => {

        const BASE_URL = process.env.REACT_APP_BASE_URL

        const POST_URL = BASE_URL + responseSelected

        console.log("Post URL:" + POST_URL)

        setThinking(true)

        try {
            const response = await fetch(POST_URL, {
                method: 'POST',
                timeout: 600000,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    "dataType": "json",
                },
                body: JSON.stringify({
                    msg: messageContent,
                    "id": cookies.id,
                    "response_type": responseSelected,
                    "request_type": requestSelected
                }),
                credentials: 'include'
            })
            processReplyMessage(response, responseSelected).then(r => setThinking(false))
        } catch (error) {
            // 在这里处理CORS及其他异常
            console.error("There was a problem with the fetch operation:", error);
            setThinking(false)
        }

    }


    const processReplyMessage = async (response, messageType) => {

        if (response.status!=200){
            updateMessage("Error with response code:"+response.status, true, messageType);
            console.log(`Request failed with status code ${response.status}`)
        }else {
            const data = await response.json()
            updateMessage(data, true, messageType)
        }


        setThinking(false)
    }



    const processFile = (event) => {
        if (event.target.files.length > 0) {
            updateMessage(event.target.files[0].name, false, MESSAGE_TYPE.TEXT);
            sendCommand(COMMANDS.YU_XUE_Xi_PDF, API_PATH.YU_XUE_Xi_PDF, event.target.files[0]);
            event.target.value = '';
        }
    }

    /**
     * Sends our prompt to our API and get response to our request from openai.
     *
     * @param {Event} e - The submit event of the form.
     */



    const send = () => {
        switch (message.trim()) {
            case COMMANDS.YU_XUE_Xi_PDF:
                updateMessage(message, false, MESSAGE_TYPE.TEXT)
                console.log("Waiting for file selection...");
                fileInputRef.current.click();

                break;
            case COMMANDS.QING_CHU_JI_YI:
                updateMessage(message, false, MESSAGE_TYPE.TEXT)
                sendMessage(message)
                break;
            default :
                updateMessage(message, false, requestSelected)
                sendMessage(message)

                break;
        }
        console.log("Done")
        setMessage('')
    };


    /**
     * Adds a new message to the chat.
     *
     * @param messageContent - The text of the new message. json or text
     * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
     * @param {string} [type="text"] - Message type
     */

    const updateMessage = (messageContent, ai = false, type = "text") => {
        const newMsg = {
            createdAt: Date.now(),
            ai: ai,
            content: (messageContent.hasOwnProperty("error")) ? messageContent.error : messageContent,
            type: `${type}`,
        };
        // Call addMessage function to update UI
        addMessage(newMsg);
        //console.log(messages)
        saveMessage(newMsg);



    };

    return (
        <form className='form'>
            <Row className='chat-footer'>
                <input type="file" id="btn_file" ref={fileInputRef} accept=".pdf" onChange={processFile}
                    style={{display: 'none'}}/>

                <Col sm={20} xs={24}>
                    <Input.TextArea ref={inputRef} value={message} onChange={event => {
                        setMessage(event.target.value)
                    }} showCount={true} autoSize={{minRows: 5, maxRows: 5}} className='chatview__textarea-message'/>
                </Col>
                <Col sm={4} xs={24} style={{padding:'.5rem'}}>
                    <Button type="submit" className='chatview__btn-send' disabled={!message} onClick={send}>Send</Button>
                </Col>
            </Row>
        </form>
    )

};

export default ChatForm;