import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, Row, Col} from 'antd';
import {API_PATH, COMMANDS, MESSAGE_TYPE} from "../common/constant";
import {useCookies} from "react-cookie";
import io from "socket.io-client";
import {set} from "idb-keyval";
import store from "../common/storage";
import {ulid} from "ulid";
import sleep from "sleep-promise";



const ChatForm = ({addMessage,setThinking,messages}) => {

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
        const socket = io.connect(process.env.REACT_APP_WS_URL);
        socket.on('reply', function (data) {
            console.log('reply' + JSON.stringify(data))
            appendStreamMessage(data)
        });
        socket.on('final', function (data) {
            console.log('final' + JSON.stringify(data))
            appendStreamMessage(data)
        });
        socket.on('disconnect', function (data) {
            //console.log(data)
        });
        const requestBody = {
            msg: message.content,
            uid: cookies.id,
            messageID: ulid(),
            response_type: responseSelected,
            request_type: requestSelected,
        }
        console.log("wqd:"+requestBody.messageID+" "+message.messageID)
        createStreamMessage(requestBody.messageID);
        //socket.emit("message", requestBody);
    }



    const saveMessage=(newMsg)=>{

        set(newMsg.messageID, newMsg, store)
            .then(() => {
                //console.log("Message saved to indexedDB");
            })
            .catch((error) => {
                console.error("Error updating inputMessage in indexedDB:", error);
            });
    }




    const sendCommand = async (commandContent, api_path, file = null) => {

        const POST_URL = process.env.REACT_APP_BASE_URL + api_path
        setThinking(true)
        const formData = new FormData();
        const messageID=ulid();
        await sleep(1);
        formData.append("msg", commandContent);
        formData.append("messageID",messageID)
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

        //await processReplyMessage(response, MESSAGE_TYPE.TEXT)

        if (response.status!=200){
            createReplyMessage("Error with response code:"+response.status);
            //console.log(`Request failed with status code ${response.status}`)
        }else {
            const data = await response.json()
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



    const send = async () => {
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
                //sendStreamMessage(createSendMessage(inputMessage))
                const sendMessage = await createSendMessage(inputMessage)
                sendStreamMessage(sendMessage)
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
        saveMessage(message);
        return message;
    };




    const appendStreamMessage = async (messageContent) => {
        const message = {
            createdAt: Date.now(),
            ai: true,
            type: MESSAGE_TYPE.TEXT,
            messageID: messageContent.messageID,
            content: messageContent.content,
        };
        // Call addMessage function to update UI
        console.log("createStreamMessage:" + JSON.stringify(message))
        await addMessage(message);
        console.log("message:" + JSON.stringify(messages.get(message.messageID)))
        return message;
    };

    const createStreamMessage = async (messageID) => {
        console.log("messageID:" + messageID)
        const message = {
            createdAt: Date.now(),
            ai: true,
            type: MESSAGE_TYPE.TEXT,
            messageID: messageID,
            content: "",
        };
        // Call addMessage function to update UI
        console.log("createStreamMessage:" + JSON.stringify(message))
        await addMessage(message);
        saveMessage(message)
        console.log("message:" + JSON.stringify(messages.get(message.messageID)))
        return message;
    };




    const createSendMessage = async (messageContent) => {
        const message = {
            createdAt: Date.now(),
            messageID: ulid(),
            ai: false,
            type: MESSAGE_TYPE.TEXT,
            content: messageContent,
        };
        await addMessage(message);
        saveMessage(message);
        //console.log("Message:"+JSON.stringify(message))
        return message;
    };



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