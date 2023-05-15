import React, {useContext, useState} from "react";
import {Modal, Select} from "antd";
import {PROMOTES} from "../common/constant";
import {ulid} from "ulid";
import useLocalStorage, {SelectedConversationIdKey} from "../hooks/useLocalStorage";
import {ChatContext} from "../context/chatContext";

const ConversationSettingModal = ({isSettingsModalVisible,handleSettingsModalCancel,setIsSettingsModalVisible}) => {
    //const [promoteSelected, setPromoteSelected] = useState("");
    const [conversationName, setConversationName] = useState("");
    const [systemPromote, setSystemPromote] = useState("");
    const [_, setStoreConversationId] = useLocalStorage(SelectedConversationIdKey, '');
    const {setSelectedConversationId, conversationsContext,setSelectedSystemPromote} = useContext(ChatContext);
    const {saveDataToDB} = conversationsContext;

    const handleChange = (value) => {
        //setPromoteSelected(value);
        setConversationName(PROMOTES[value].act)
        setSystemPromote(PROMOTES[value].prompt)
        console.log(conversationName)
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log({ textInput: conversationName, textAreaInput: systemPromote });
        const id = ulid();
        const initCV = {
            id,
            title: conversationName,
            createdAt: Date.now(),
            promote: systemPromote,
        }
        setStoreConversationId(id);
        setSelectedConversationId(id);
        saveDataToDB(initCV);
        setIsSettingsModalVisible(false);
        setSelectedSystemPromote(systemPromote);
        //window.location.reload(true);
    };
    const { Option } = Select;






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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropdown">
                        Role
                    </label>
                    <Select
                        showSearch
                        style={{ width: "100%" }}
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

                        {/*<Option value="option1">选项1</Option>*/}
                        {/*<Option value="option2">选项2</Option>*/}
                    </Select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input">
                        Conversation Name
                    </label>
                    <input
                        value={conversationName}
                        onChange={(e) => setConversationName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="input"
                        type="text"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textarea">
                        Promote
                    </label>
                    <textarea
                        value={systemPromote}
                        onChange={(e) => setSystemPromote(e.target.value)}
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