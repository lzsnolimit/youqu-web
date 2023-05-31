import React, {useContext, useEffect, useState} from "react";
import {Modal, Select, Radio} from "antd";
import {PROMOTES} from "../common/constant";
import {ulid} from "ulid";
import useLocalStorage, {SelectedConversation} from "../hooks/useLocalStorage";
import {ChatContext} from "../context/chatContext";

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
        user
    } = useContext(ChatContext);

    const {saveDataToDB} = conversationsContext;

    const [conversationId, setConversationId] = useState(null);
    const [title, setTitle] = useState("");
    const [promote, setPromote] = useState("");
    const [type, setType] = useState("Chat");
    const [model, setModel] = useState(null);
    const [document, setDocument] = useState(null);

    useEffect(() => {
        if (isNewConversation||!currentConversation) {
            setConversationId(ulid());
            setTitle("");
            setPromote("");
        } else {
            setConversationId(currentConversation.id);
            setTitle(currentConversation.title);
            setPromote(currentConversation.promote);
        }

        console.log("isNewConversation: " + isNewConversation);
        console.log("title: " + title);
    }, [isNewConversation, currentConversation]);

    const handleChange = (value) => {
        setTitle(PROMOTES[value].act);
        setPromote(PROMOTES[value].prompt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const conversation = {
            id: conversationId,
            title: title,
            promote: promote,
            type: type,
            model: model,
            document: type === "Reading" ? document : null,
        };

        saveDataToDB(conversation);
        setCurrentConversation(conversation);
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
                            Type
                        </label>
                        <Radio.Group
                            onChange={(e) => setType(e.target.value)}
                            value={type}
                        >
                            <Radio value="Chat">对话</Radio>
                            <Radio value="Reading">读书</Radio>
                            <Radio value="Paint">画画</Radio>
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
                    {type === "Reading" && (
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