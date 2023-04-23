import React, { useContext, useEffect, useRef, useState } from 'react';
import {Button, Col, Input, Row} from 'antd';
import {API_PATH, COMMANDS, MESSAGE_TYPE} from "../common/constant";
import {useCookies} from "react-cookie";
import io from "socket.io-client";
import {ulid} from "ulid";
import { update } from "idb-keyval";
import { conversationsStore } from "../common/storage";
import { ChatContext } from "../context/chatContext";
import useLocalStorage, { SelectedConversationIdKey } from "../hooks/useLocalStorage";


const ChatForm = ({addMessage, setThinking}) => {

    const {selectedConversationId, setSelectedConversationId, conversationsContext} = useContext(ChatContext);
    const [_, setStoreConversationId] = useLocalStorage(SelectedConversationIdKey, '');
    const {saveDataToDB} = conversationsContext;
    const [cookies] = useCookies(['id', 'Authorization']);

    const [requestSelected, setRequestSelected] = useState(API_PATH.TEXT)
    const [responseSelected, setResponseSelected] = useState(MESSAGE_TYPE.TEXT)
    const [inputMessage, setInputMessage] = useState("")
    const fileInputRef = useRef(null);
    const inputRef = useRef()

    //const [socket, setSocket] = useState(null);

    /**
     * Focuses the TextArea input to when the component is first rendered.
     */
    useEffect(() => {
        inputRef.current.focus()
    }, [])


    const sendStreamMessage = (message) => {
        //console.log("sendStreamMessage:", JSON.stringify(message));
        const socket = io.connect(process.env.REACT_APP_WS_URL,{withCredentials: false,});
        socket.on('reply', function (data) {
            //console.log('reply' + JSON.stringify(data))
            appendStreamMessage(data)
        });
        socket.on('final', function (data) {
            console.log('final' + JSON.stringify(data))
            appendStreamMessage(data)
        });
        socket.on('disconnect', function (data) {
            console.log('disconnect')
        });
        const requestBody = {
            msg: message.content,
            uid: cookies.id,
            messageID: ulid(),
            response_type: responseSelected,
            request_type: requestSelected,
            conversation_id: selectedConversationId
        }
        //console.log("requestBody："+JSON.stringify(requestBody))
        createStreamMessage(requestBody.messageID);
        socket.emit("message", requestBody);
    }





    const sendCommand = async (commandContent, api_path, file = null) => {

        const POST_URL = process.env.REACT_APP_BASE_URL + api_path
        setThinking(true)
        const formData = new FormData();
        const messageID=ulid();
        formData.append("msg", commandContent);
        formData.append("messageID",messageID)
        if (file) {
            formData.append("files", file);
        }
        formData.append("uid", cookies.id);
        formData.append("conversation_id", selectedConversationId);
        const response = await fetch(POST_URL, {
            method: 'POST',
            timeout: 600000,
            headers: {
                "dataType": "json",
            },
            body: formData, // 使用 formData 作为 body
            credentials: 'include'
        })

        //await processReplyMessage(response, MESSAGE_TYPE.TEXT)

        if (response.status!=200){
            const data={
                content:"Error with response code:"+response.status,
                messageID:ulid()
            }
            createReplyMessage(data);
            //console.log(`Request failed with status code ${response.status}`)
        }else {
            const data = await response.json()
            data["messageID"]=ulid()
            createReplyMessage(data)
        }
        setThinking(false)
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
     * @param {Event} e - The submit event of the form.
     */



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
        addMessage(message);
        return message;
    };




    const appendStreamMessage = (messageContent) => {
        const message = {
            createdAt: Date.now(),
            ai: true,
            type: MESSAGE_TYPE.TEXT,
            messageID: messageContent.messageID,
            content: messageContent.content,
        };
        // Call addMessage function to update UI
        //console.log("createStreamMessage:" + JSON.stringify(message))
        addMessage(message);
    };

    const createStreamMessage = (messageID) => {
        //console.log("messageID:" + messageID)
        const message = {
            createdAt: Date.now(),
            ai: true,
            type: MESSAGE_TYPE.TEXT,
            messageID: messageID,
            content: "Thinking...",
        };
        // Call addMessage function to update UI
        //console.log("createStreamMessage:" + JSON.stringify(message))
        addMessage(message);
        return message;
    };


    const createSendMessage = (messageContent) => {
        const message = {
            createdAt: Date.now(),
            messageID: ulid(),
            ai: false,
            type: MESSAGE_TYPE.TEXT,
            content: messageContent,
        };

        if (selectedConversationId) {
            onUpdateTitle(message);
        } else {
            createConversation()
        }
        addMessage(message)
        return message;
    };

    const createConversation = async () => {
        const id = ulid();
        const initCV = {
            id,
            title: 'New chat',
            createdAt: Date.now(),
        }

        setSelectedConversationId(id);
        setStoreConversationId(id);
        await saveDataToDB(initCV)
    }

    const onUpdateTitle = (message) => {
        update(
          selectedConversationId,
          (oldValue) => ({...oldValue, title: message.content}),
          conversationsStore
        )
          .then(() => {
              // TODO  rerender view
          })
    }



    return (
        <form className='form'>
            <Row className='chat-footer'>
                <input type="file" id="btn_file" ref={fileInputRef} accept=".pdf" onChange={processFile}
                    style={{display: 'none'}}/>

                <Col sm={20} xs={18}>
                    <Input.TextArea ref={inputRef} value={inputMessage} onChange={event => {
                        setInputMessage(event.target.value)
                    }} showCount={true} autoSize={{minRows: 3, maxRows: 5}} className='chatview__textarea-message'/>
                </Col>
                <Col sm={4} xs={6} style={{padding:'.5rem'}}>
                    <Button type="submit" className='chatview__btn-send' disabled={!inputMessage} onClick={send}>Send</Button>
                </Col>
            </Row>
        </form>
    )

};

export default ChatForm;