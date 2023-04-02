import React, {useContext, useEffect, useRef, useState} from 'react'
import ChatMessage from './ChatMessage'
import {ChatContext} from '../context/chatContext'
import Thinking from './Thinking'
import {createStore, set} from 'idb-keyval';
import {useCookies} from "react-cookie";
import {Button, Input} from 'antd';
import {API_PATH, COMMANDS, MESSAGE_TYPE} from '../common/constant'

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const messagesEndRef = useRef()
    const inputRef = useRef()
    const [thinking, setThinking] = useState(false)
    const [message, setMessage] = useState("")
    const [requestSelected, setRequestSelected] = useState(API_PATH.TEXT)
    const [responseSelected, setResponseSelected] = useState(MESSAGE_TYPE.TEXT)
    const [messages, addMessage] = useContext(ChatContext)
    const [cookies, setCookie, removeCookie] = useCookies(['id', 'Authorization']);
    const fileInputRef = useRef(null);


    /**
     * Scrolls the chat area to the bottom.
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    /**
     * Adds a new message to the chat.
     *
     * @param messageContent - The text of the new message. json or text
     * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
     */

    const store = new createStore("youqu.app", "messages");

    const updateMessage = (message, ai = false, type = "text") => {
        const newMsg = {
            createdAt: Date.now(),
            ai: ai,
            content: (message.hasOwnProperty("error")) ? message.error : message,
            type: `${type}`,
        };

        addMessage(newMsg);
        //console.log(messages)
        set(Date.now(), newMsg, store)
            .then(() => {
                console.log("Message saved to indexedDB");
            })
            .catch((error) => {
                console.error("Error updating message in indexedDB:", error);
            });

        // Call addMessage function to update UI

    };

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


    const processFile = (event) => {
        if (event.target.files.length > 0) {
            updateMessage(event.target.files[0].name, false, MESSAGE_TYPE.TEXT);
            sendCommand(COMMANDS.YU_XUE_Xi_PDF, API_PATH.YU_XUE_Xi_PDF, event.target.files[0]);
            event.target.value = '';
        }
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


    /**
     * Scrolls the chat area to the bottom when the messages array is updated.
     */
    useEffect(() => {
        scrollToBottom()
    }, [messages, thinking])

    /**
     * Focuses the TextArea input to when the component is first rendered.
     */
    useEffect(() => {
        inputRef.current.focus()
    }, [])


    return (
        <div className="chatview">
            <main className='chatview__chatarea'>

                {messages.map((message, index) => (
                    <ChatMessage key={index} message={{...message}}/>
                ))}

                {thinking && <Thinking/>}

                <span ref={messagesEndRef}></span>
            </main>
            <form className='form'>
                <input type="file" id="btn_file" ref={fileInputRef} accept=".pdf" onChange={processFile}
                       style={{display: 'none'}}/>

                <Input.TextArea ref={inputRef} value={message} onChange={event => {
                    setMessage(event.target.value)
                }} showCount={true} autoSize={{minRows: 5, maxRows: 5}}
                                className='chatview__textarea-message'
                />
                <Button type="submit" className='chatview__btn-send' disabled={!message} onClick={send}>Send</Button>
            </form>
        </div>
    )
}

export default ChatView