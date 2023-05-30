import React, {useContext, useState} from 'react';
import useLocalStorage, {SelectedConversation} from "../hooks/useLocalStorage";
import {ChatContext} from "../context/chatContext";
import ConversationIcons from "./ConversationIcons";
import ConversationSettingModal from "./ConversationSettingModal";
import {messagesStore} from "../common/storage";
import {initialMsg} from "../common/constant";
import useIndexedDB from "../hooks/useIndexedDB";

const Conversations = () => {
  const {currentConversation,setCurrentConversation,conversationsContext} = useContext(ChatContext);
  const {dbData, saveDataToDB, deleteDataById} = conversationsContext;
  
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const messagesContext = useIndexedDB(messagesStore, initialMsg);
  const {dbData: messagesDbData , deleteManyByIds} = messagesContext;
  const [isNewConversation, setIsNewConversation] = useState(false);
  const handleSettingsModalCancel = (e) => {
    e.stopPropagation();
    setIsSettingsModalVisible(false)
  }

  const onChangeConversation = async (conversation) => {
    await setCurrentConversation(conversation);
  }

  const onDeleteConversation = async () => {
    // clear messages
    const willDeleteMessageIds = Array.from(messagesDbData.values())
      .filter((message) => message.conversationId === currentConversation.id)
      .map((message) => message.id)
    await deleteManyByIds(willDeleteMessageIds);
    await deleteDataById(currentConversation.id);
    setCurrentConversation(null);
  }
  const createNewConversation = () => {
    console.log("currentConversation: " + JSON.stringify(currentConversation))
    setIsNewConversation(true);
    setIsSettingsModalVisible(true);
  }

  const isSelected = (conversation) => currentConversation.id === conversation.id;

  return(
    <>
      <div className="conversations">
        <div className="conversations__add_chat" onClick={() => createNewConversation()}>+ New chat</div>
        <ConversationSettingModal setIsSettingsModalVisible={setIsSettingsModalVisible} isSettingsModalVisible={isSettingsModalVisible} handleSettingsModalCancel={handleSettingsModalCancel} isNewConversation={isNewConversation}/>
        {Array.from(dbData.values()).map((conversation) => (
          <div
            key={conversation.id}
            className="conversations__chat"
            onClick={() => onChangeConversation(conversation)}
            style={{background: isSelected(conversation) && '#343541'}}
          >
            <div className="conversations__title">
              {conversation.title.length > 8
                  ? conversation.title.substr(0, 8) + "..."
                  : conversation.title}
            </div>
            <ConversationIcons
              conversation={conversation}
              onDelete={onDeleteConversation}
              isSelected={isSelected}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default Conversations;