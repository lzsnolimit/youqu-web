import React, {useContext, useState} from 'react';
import useIndexedDB from '../hooks/useIndexedDB';
import ConversationIcons from './ConversationIcons';
import ConversationSettingModal from './ConversationSettingModal';
import {ChatContext} from '../context/chatContext';
import {messagesStore} from '../common/storage';
import {initialMsg} from '../common/constant';
import {json} from "react-router-dom";

const Conversations = () => {
    const {currentConversation, setCurrentConversation, conversationsContext, user} = useContext(ChatContext);
    const {dbData, saveDataToDB, deleteDataById} = conversationsContext;

    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const messagesContext = useIndexedDB(messagesStore, initialMsg);
    const {dbData: messagesDbData, deleteManyByIds} = messagesContext;
    const [isNewConversation, setIsNewConversation] = useState(false);

    const handleSettingsModalCancel = (e) => {
        e.stopPropagation();
        setIsNewConversation(false);
        setIsSettingsModalVisible(false);
    }

    const onChangeConversation = async (conversation) => {
        await setCurrentConversation(conversation);
    }

    const onDeleteConversation = async () => {
        // clear messages
        const willDeleteMessageIds = Array.from(messagesDbData.values())
            .filter((message) => message.conversationId === currentConversation?.id)
            .map((message) => message.id)
        await deleteManyByIds(willDeleteMessageIds);
        await deleteDataById(currentConversation?.id);
        setCurrentConversation(null);
    }

    const createNewConversation = () => {
        console.log("currentConversation: " + JSON.stringify(currentConversation))
        setIsNewConversation(true);
        setIsSettingsModalVisible(true);
    }

    const isSelected = (conversation) => currentConversation?.id === conversation.id;

    return (
        <>
            <div className="conversations">
                <div className="conversations__add_chat" onClick={() => createNewConversation()}>+ New chat</div>
                <ConversationSettingModal setIsSettingsModalVisible={setIsSettingsModalVisible}
                                          isSettingsModalVisible={isSettingsModalVisible}
                                          handleSettingsModalCancel={handleSettingsModalCancel}
                                          isNewConversation={isNewConversation}/>
                {user&&Array.from(dbData.values()).map((conversation) => {
                  //if conversation has user_id, it is a group chat
                    if (('user_id' in conversation)&& (conversation?.user_id !== user.user_id) ){
                        return null;
                    } else {
                        const conversationId = conversation?.id;
                        const conversationTitle = conversation?.title || '';
                        return (
                            <div
                                key={conversationId}
                                className="conversations__chat"
                                onClick={() => onChangeConversation(conversation)}
                                style={{background: isSelected(conversation) ? '#343541' : 'inherit'}}
                            >
                                <div className="conversations__title">
                                    {conversationTitle.length > 8 ? conversationTitle.substr(0, 8) + "..." : conversationTitle}
                                </div>
                                <ConversationIcons
                                    conversation={conversation}
                                    onDelete={onDeleteConversation}
                                    isSelected={isSelected}
                                    isSettingsModalVisible={isSettingsModalVisible}
                                    setIsSettingsModalVisible={setIsSettingsModalVisible}
                                    setIsNewConversation={setIsNewConversation}
                                />
                            </div>
                        );
                    }


                })}
            </div>
        </>
    )
}

export default Conversations;