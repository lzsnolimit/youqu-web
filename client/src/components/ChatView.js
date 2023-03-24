import React, {useContext, useEffect, useRef, useState} from 'react'
import ChatMessage from './ChatMessage'
import {ChatContext} from '../context/chatContext'
import Thinking from './Thinking'
import {Button} from '@material-ui/core';
import {get, set, createStore} from 'idb-keyval';


/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
    const messagesEndRef = useRef()
    const inputRef = useRef()
    const [formValue, setFormValue] = useState('')
    const [thinking, setThinking] = useState(false)
    const requestOptions = ['text', 'picture', 'voice']
    const responseOptions = ['text', 'picture', 'voice']
    const [requestSelected, setRequestSelected] = useState(requestOptions[0])
    const [responseSelected, setResponseSelected] = useState(responseOptions[0])
    const [messages, addMessage] = useContext(ChatContext)

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
            content: message,
            type: `${type}`,
        };
        addMessage(newMsg);
        console.log(messages)
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
    const sendMessage = async (e) => {
        e.preventDefault()

        const messageContent = formValue
        const requestType = requestSelected

        const BASE_URL = process.env.REACT_APP_BASE_URL

        const POST_URL = BASE_URL + responseSelected

        console.log("Post URL:" + POST_URL)

        setThinking(true)
        setFormValue('')
        updateMessage(messageContent, false, requestType)


        const response = await fetch(POST_URL, {
            method: 'POST',
            timeout: 600000,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "dataType": "json",
            },
            body: JSON.stringify({
                msg: messageContent,
                "id": "23de6e55-77b5-4d3d-b7de-ee4f7644f24a",
                "response_type": responseSelected,
                "request_type": requestSelected
            }),
            credentials: 'include'
        })


        const data = await response.json()

        console.log(response.status)
        if (response.ok) {
            updateMessage(data, true, responseSelected)
            // The request was successful
        } else if (response.status === 429) {
            setThinking(false)
        } else {
            // The request failed
            window.alert(`openAI is returning an error: ${response.status + response.statusText} 
      please try again later`)
            console.log(`Request failed with status code ${response.status}`)
            setThinking(false)
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

    const initRows = 2;
    const maxTextAreaHeight = 130;
    const adjustHeight = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, maxTextAreaHeight) + 'px';
    };

    return (
        <div className="chatview">
            <main className='chatview__chatarea'>

                {messages.map((message, index) => (
                    <ChatMessage key={index} message={{...message}}/>
                ))}

                {thinking && <Thinking/>}

                <span ref={messagesEndRef}></span>
            </main>
            <form className='form' onSubmit={sendMessage}>
                <select value={requestSelected} defaultValue={requestOptions[0]} title="Select request type"
                        onChange={(e) => setRequestSelected(e.target.value)} className="dropdown">
                    <option value={requestOptions[0]}>{requestOptions[0]}</option>
                    <option value={requestOptions[1]}>{requestOptions[1]}</option>
                    <option value={requestOptions[2]}>{requestOptions[2]}</option>

                </select>
                <select value={responseSelected} defaultValue={responseOptions[0]} title="Select response type"
                        onChange={(e) => setResponseSelected(e.target.value)} className="dropdown">
                    <option value={responseOptions[0]}>{responseOptions[0]}</option>
                    <option value={responseOptions[1]}>{responseOptions[1]}</option>
                    <option value={responseOptions[2]}>{responseOptions[2]}</option>

                </select>
                <textarea ref={inputRef} rows={initRows} className='chatview__textarea-message' value={formValue}
                          onChange={(e) => {
                              setFormValue(e.target.value);
                              adjustHeight(e);
                          }} onKeyDown={(e) => {
                    if (e.shiftKey && e.keyCode === 13) {
                        e.preventDefault()
                    }
                }}/>
                <Button type="submit" className='chatview__btn-send' disabled={!formValue}>Send</Button>
            </form>
        </div>
    )
}

export default ChatView