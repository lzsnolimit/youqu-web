import React, {useContext, useEffect, useState} from "react";
import {Modal, Select, Radio,message, Upload, Button} from "antd";
import {API_PATH, MESSAGE_TYPE, PROMOTES} from "../common/constant";
import {ulid} from "ulid";
import useLocalStorage, {SelectedConversation} from "../hooks/useLocalStorage";
import {ChatContext} from "../context/chatContext";
import {icons} from "react-icons";
import {useCookies} from "react-cookie";





const ConversationSettingModal = ({
                                      isSettingsModalVisible,
                                      handleSettingsModalCancel,
                                      setIsSettingsModalVisible,
                                      isNewConversation,
                                  }) => {
    const [_, setStoreConversationId] = useLocalStorage(
        SelectedConversation,
        ""
    );
    const {
        currentConversation,
        setCurrentConversation,
        conversationsContext,
        user,
        sendMessage,
    } = useContext(ChatContext);
    const [cookies] = useCookies(['Authorization']);



    const props = {
        name: 'file',
        action: process.env.REACT_APP_BASE_URL + API_PATH.YU_XUE_Xi_PDF,
        headers: {
            authorization: cookies.Authorization,
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully,we will send you an email once file training is done`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
            setDocument(null)
        },
    };


    const {saveDataToDB} = conversationsContext;
    const [conversationId, setConversationId] = useState(null);
    const [title, setTitle] = useState("");
    const [promote, setPromote] = useState("");
    const [response_type, setResponse_type] = useState("text");
    const [model, setModel] = useState(null);
    const [document, setDocument] = useState(null);

    // useEffect(()=>{
    //     if (document!=null&&document==="upload"){
    //         //window.open("/#/upload", "_blank");
    //         setDocument(null)
    //     }
    // },[document])

    useEffect(() => {
        if (isNewConversation||!currentConversation) {
            setConversationId(ulid());
            setTitle("");
            setPromote("");
        } else {
            setConversationId(currentConversation.id);
            setTitle(currentConversation.title);
            setPromote(currentConversation.promote);
            setResponse_type(currentConversation.response_type);
            setModel(currentConversation.model);
        }

        console.log("isNewConversation: " + isNewConversation);
        console.log("title: " + title);
    }, [isNewConversation, currentConversation]);

    const handleChange = (value) => {
        setTitle(PROMOTES[value].act);
        setPromote(PROMOTES[value].prompt);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const conversation = {
            id: conversationId,
            title: title,
            promote: promote,
            response_type: response_type,
            model: model,
            document: response_type === "reading" ? document : null,
        };

        saveDataToDB(conversation);
        setCurrentConversation(conversation);
        if (!isNewConversation){
            sendMessage('update_conversation', {
                conversation_id: conversationId,
                title: title,
                promote: promote,
                response_type: response_type,
                model: model,
                document: response_type === "reading" ? document : null,
            });
        }
        setIsSettingsModalVisible(false);
    };
    const {Option} = Select;

    return (
        <Modal
            title="Conversation Setting"
            open={isSettingsModalVisible}
            onCancel={handleSettingsModalCancel}
            footer={null}
            centered
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="radio"
                        >
                            Response Type
                        </label>
                        <Radio.Group
                            onChange={(e) => setResponse_type(e.target.value)}
                            value={response_type}
                        >
                            <Radio value={MESSAGE_TYPE.TEXT}>文字</Radio>
                            {/*<Radio value={MESSAGE_TYPE.AUDIO}>语音</Radio>*/}
                            <Radio value="reading">读书</Radio>
                            <Radio value={MESSAGE_TYPE.PICTURE}>绘画</Radio>
                        </Radio.Group>
                    </div>



                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Model
                        </label>
                        <Select
                            value={model}
                            onChange={(value) => setModel(value)}
                            style={{width: "100%"}}
                        >
                            {user&&user.available_models.map((model, index) => (
                                <Option key={index} value={model}>
                                    {model}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    {response_type === "reading" && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Document
                            </label>
                            <Select
                                value={document}
                                onChange={(value) => setDocument(value)}
                                style={{width: "100%"}}
                            >
                                {user && user.available_documents.map((doc, index) => (
                                    <Option key={index} value={doc.id}>
                                        {doc.title}
                                    </Option>
                                ))}
                            </Select>
                            { !document&&<Upload {...props}>
                                <Button >Click to Upload</Button>
                            </Upload>}
                        </div>



                    )}
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="dropdown"
                        >
                            Role
                        </label>
                        <Select
                            showSearch
                            style={{width: "100%"}}
                            placeholder="请选择"
                            optionFilterProp="children"
                            onChange={handleChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {PROMOTES.map((promote, index) => (
                                <Option key={index} value={index}>
                                    {promote.act}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="input"
                        >
                            Conversation Name
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="input"
                            type="text"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="textarea"
                        >
                            Prompt
                        </label>
                        <textarea
                            value={promote}
                            onChange={(e) => setPromote(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-60"
                            id="textarea"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ConversationSettingModal;