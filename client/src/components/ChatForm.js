import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Input, Row} from "antd";
import {MESSAGE_TYPE} from "../common/constant";
import {ulid} from "ulid";
import {ChatContext} from "../context/chatContext";

const ChatForm = ({ saveMessagesToDB, setNewReplyMessage,newReplyMessage }) => {
    const {
        currentConversation,
        sendMessage,
    } = useContext(ChatContext);
    const [inputMessage, setInputMessage] = useState("");
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const keyboardSend = (event) => {
        let keyCode = event.keyCode || event.charCode;
        let altKey = event.altKey;
        if (altKey && keyCode === 13) {
            send();
        }
    };

    const stop= async () => {
        console.log('stop')
        sendMessage('stop', {});
    }

    const send = () => {
        const message = {
            createdAt: Date.now(),
            messageID: ulid(),
            ai: false,
            type: MESSAGE_TYPE.TEXT,
            content: inputMessage,
            conversationId: currentConversation.id,
        };
        addMessageInDB(message);
        sendStreamMessage(message);
        setInputMessage("");
    };

    const addMessageInDB = async (message) => {
        const id = message?.messageID || undefined;
        await saveMessagesToDB({
            ...message,
            id,
            conversationId: message.conversationId
                ? message.conversationId
                : currentConversation.id,
        });
    };

    const sendStreamMessage = (message) => {
        const requestBody = {
            msg: message.content,
            messageID: ulid(),
            response_type: currentConversation?.response_type || MESSAGE_TYPE.TEXT,
            model: currentConversation?.model || "gpt-3.5-turbo",
            conversation_id: currentConversation?.id,
            system_prompt: currentConversation?.promote,
            conversation_type: currentConversation?.conversation_type,
            document: currentConversation?.document,
        };


        console.log("requestBody", JSON.stringify(requestBody));
        setNewReplyMessage({
            createdAt: Date.now(),
            ai: true,
            type: MESSAGE_TYPE.TEXT,
            messageID: requestBody.messageID,
            conversationId: currentConversation.id,
            content: "Thinking...",
        });
        sendMessage("message", requestBody);
    };



    return (
            <form className="form">
            <Row className="chat-footer">
                <Col sm={18} xs={14}>
                    <Input.TextArea

                        disabled={currentConversation == null}
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
                            if (event.shiftKey && event.key === "Enter" && inputMessage) {
                                send();
                                event.preventDefault(); // Prevent adding a new line
                            }
                        }}
                        placeholder="Shift+Enter 发送"
                    />
                </Col>
                <Col sm={4} xs={6} style={{ padding: ".5rem" }}>
                    {newReplyMessage?<Button
                        type="submit"
                        className="chatview__btn-send"
                        onClick={stop}
                    >
                        Stop
                    </Button>:<Button
                        type="submit"
                        className="chatview__btn-send"
                        disabled={!inputMessage}
                        onClick={send}
                    >
                        Send
                    </Button>}




                </Col>
            </Row>
        </form>
    );
};

export default React.memo(ChatForm);