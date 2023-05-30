import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Col, Input, Row, Select} from 'antd';
import {API_PATH, COMMANDS, MESSAGE_TYPE} from "../common/constant";
import {useCookies} from "react-cookie";
import {ulid} from "ulid";
import {update} from "idb-keyval";
import {conversationsStore} from "../common/storage";
import {ChatContext} from "../context/chatContext";
import useLocalStorage, {SelectedConversation} from "../hooks/useLocalStorage";
import axios from "axios";



const ChatForm = ({ saveMessagesToDB,setNewReplyMessage,newReplyMessage }) => {

    const { conversationsContext,currentConversation,socketRef,user} = useContext(ChatContext);
    const [cookies] = useCookies(['Authorization']);
    // const [responseSelected, setResponseSelected] = useState(MESSAGE_TYPE.TEXT)
    const [inputMessage, setInputMessage] = useState("")
    const fileInputRef = useRef(null);
    const inputRef = useRef()

    // ...原有代码

    const addMessageInDB = async (message) => {
        const id = message?.messageID || undefined;
        await saveMessagesToDB({
            ...message,
            id,
            conversationId: message.conversationId ? message.conversationId : currentConversation.id,
        });
    };


    /**
     * Focuses the TextArea input to when the component is first rendered.
     */
    useEffect(() => {
        inputRef.current.focus()
    }, [])






    const sendStreamMessage = (message) => {
        if (!socketRef.current) {
            console.log('socket.current is null')
            return;
        }

        const requestBody = {
            msg: message.content,
            messageID: ulid(),
            response_type: currentConversation?.response_type || 'text',
            model: currentConversation?.model || 'gpt-3.5-turbo',
            conversation_id: currentConversation?.id,
            system_prompt: currentConversation?.promote,
        }
        console.log("requestBody："+JSON.stringify(requestBody))
        createStreamMessage(requestBody.messageID);
        socketRef.current.emit("message", requestBody);
    }





    const sendCommand = async (commandContent, api_path, file = null) => {

        const POST_URL = process.env.REACT_APP_BASE_URL + api_path
        const formData = new FormData();
        const messageID=ulid();
        formData.append("msg", commandContent);
        formData.append("messageID",messageID)
        formData.append("token",cookies.Authorization)

        if (file) {
            formData.append("files", file);
        }
        formData.append("uid", user.uid);
        formData.append("conversation_id", currentConversation.id);
        // const response = await fetch(POST_URL, {
        //     method: 'POST',
        //     timeout: 600000,
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     //convert formData to json
        //     //body: JSON.stringify(formData)
        //     body: formData, // 使用 formData 作为 body
        // })


        const response = await axios.post(POST_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        //await processReplyMessage(response, MESSAGE_TYPE.TEXT)

        if (response.status!=200){
            const data={
                content:"Error with response code:"+response.status,
                messageID:ulid()
            }
            createReplyMessage(data);
            //console.log(`Request failed with status code ${response.status}`)
        }else {
            const data = await response.data;
            data["messageID"]=ulid()
            createReplyMessage(data)
        }
    }



    const processFile = (event) => {
        if (event.target.files.length > 0) {
            createSendMessage(event.target.files[0].name);
            sendCommand(COMMANDS.YU_XUE_Xi_PDF, API_PATH.YU_XUE_Xi_PDF, event.target.files[0]);
            event.target.value = '';
        }
    }

    /**
     * Sends our prompt to our API and get response to our request from openai.
     *
     * @param {Event} event - The submit event of the form.
     */

    // bind alt+enter to send message
    const keyboardSend = (event) => {
        let keyCode = event.keyCode || event.charCode;
        let altKey = event.altKey;
        if(altKey && keyCode === 13) {
            send()
            setInputMessage('')
        }
    };

    const send = () => {
        switch (inputMessage.trim()) {
            case COMMANDS.YU_XUE_Xi_PDF:
                createSendMessage(inputMessage)
                //console.log("Waiting for file selection...");
                fileInputRef.current.click();
                break;
            case COMMANDS.QING_CHU_JI_YI:
                sendStreamMessage(createSendMessage(inputMessage))
                break;
            default :
                sendStreamMessage(createSendMessage(inputMessage))
                break;
        }
        //console.log("Done")
        setInputMessage('')
    };


    const createReplyMessage = (messageContent,type=MESSAGE_TYPE.TEXT) => {
        const message = {
            createdAt: Date.now(),
            messageID:messageContent.messageID,
            ai: true,
            type: `${type}`,
            content:messageContent.content,
        };
        // Call addMessage function to update UI
        console.log("Add message:"+JSON.stringify(message))
        addMessageInDB(message);
        return message;
    };






    const createStreamMessage = (messageID) => {
        //console.log("messageID:" + messageID)
        const message = {
            createdAt: Date.now(),
            ai: true,
            type: MESSAGE_TYPE.TEXT,
            messageID: messageID,
            conversationId: currentConversation.id,
            content: "Thinking...",
        };
        // Call addMessage function to update UI
        //console.log("createStreamMessage:" + JSON.stringify(message))
        setNewReplyMessage(message);
        return message;
    };

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
    };


    const createSendMessage = (messageContent) => {
        const message = {
            createdAt: Date.now(),
            messageID: ulid(),
            ai: false,
            type: MESSAGE_TYPE.TEXT,
            content: messageContent,
            conversationId: currentConversation.id,
        };

        // if (selectedConversationId) {
        //     onUpdateTitle(message);
        // } else {
        //     createConversation()
        // }
        addMessageInDB(message)
        return message;
    };


    const onUpdateTitle = (message) => {
        update(
          currentConversation.id,
          (oldValue) => ({...oldValue, title: message.content}),
          conversationsStore
        )
          .then(() => {
              // TODO  rerender view
          })
    }



    return (

        <>
            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={() => handleSuggestionClick('#清除记忆')}*/}
            {/*>*/}
            {/*    #清除记忆*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={() => handleSuggestionClick('#菜单')}*/}
            {/*>*/}
            {/*    #菜单*/}
            {/*</button>*/}
            <form className="form">
                <Row className="chat-footer">
                    <input
                        type="file"
                        id="btn_file"
                        accept=".pdf"
                        ref={fileInputRef}
                        onChange={processFile}
                        style={{ display: "none" }}
                    />
                    <Col sm={2} xs={4} className="my-auto">
                        {/*<div className="relative inline-flex">*/}
                        {/*    <select*/}
                        {/*        value={requestModelSelected}*/}
                        {/*        onChange={(event) => {*/}
                        {/*            setRequestModelSelected(event.target.value);*/}
                        {/*            console.log("requestModelSelected:"+requestModelSelected)*/}
                        {/*        }}*/}
                        {/*        className="w-full h-full pl-3 pr-10 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"                             >*/}
                        {/*        {user&& user.available_models.map((model, index) => (*/}
                        {/*            <option key={index} value={model}>{model}</option>*/}
                        {/*        ))}*/}
                        {/*    </select>*/}
                        {/*</div>*/}
                        <div className="relative inline-flex hidden">
                            <select
                                className="w-full h-full pl-3 pr-10 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>Text</option>
                                <option>Voice</option>
                            </select>
                        </div>
                    </Col>
                    {console.log("Start chatform")}
                    <Col sm={18} xs={14}  >
                        <Input.TextArea
                            disabled={!currentConversation||newReplyMessage}
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(event) => {
                                setInputMessage(event.target.value);
                            }}
                            showCount={true}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            className="chatview__textarea-message"
                            onKeyPress={(event) => {
                                keyboardSend(event);
                                if (event.shiftKey && event.key === 'Enter'&&inputMessage) {
                                    send();
                                    event.preventDefault(); // Prevent adding a new line
                                }
                            }}
                            placeholder="Shift+Enter 发送"
                        />
                    </Col>
                    <Col sm={4} xs={6} style={{ padding: ".5rem" }}>
                        <Button
                            type="submit"
                            className="chatview__btn-send"
                            disabled={!inputMessage}
                            onClick={send}
                        >
                            Send
                        </Button>
                    </Col>
                </Row>
            </form>
        </>
    )

};

export default React.memo(ChatForm);
