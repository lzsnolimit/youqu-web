import React, {useContext, useState} from 'react';
import { ulid } from "ulid";
import useLocalStorage, { SelectedConversationIdKey } from "../hooks/useLocalStorage";
import { ChatContext } from "../context/chatContext";
import ConversationIcons from "./ConversationIcons";
import ConversationSettingModal from "./ConversationSettingModal";

const Conversations = () => {
  const [_, setStoreConversationId, removeItem] = useLocalStorage(SelectedConversationIdKey, '');
  const {selectedConversationId, setSelectedConversationId, conversationsContext, messagesContext,setSelectedSystemPromote} = useContext(ChatContext);
  const {dbData, saveDataToDB, deleteDataById} = conversationsContext;
  const {dbData: messagesDbData , deleteManyByIds} = messagesContext;
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);


  const handleSettingsModalCancel = (e) => {
    e.stopPropagation();
    setIsSettingsModalVisible(false)
  }

  const onChangeConversation = (id,promote) => {
    setStoreConversationId(id);
    setSelectedConversationId(id);
    setSelectedSystemPromote(promote)
  }

  const onDeleteConversation = async () => {
    // clear messages
    const willDeleteMessageIds = Array.from(messagesDbData.values())
      .filter((message) => message.conversationId === selectedConversationId)
      .map((message) => message.id)
    await deleteManyByIds(willDeleteMessageIds);

    await deleteDataById(selectedConversationId);
    removeItem();
    setSelectedConversationId('');
  }

  const isSelected = (conversation) => selectedConversationId === conversation.id;

  return(
    <>
      <div className="conversations">
        <div className="conversations__add_chat" onClick={() => setIsSettingsModalVisible(true)}>+ New chat</div>
        <ConversationSettingModal setIsSettingsModalVisible={setIsSettingsModalVisible} isSettingsModalVisible={isSettingsModalVisible} handleSettingsModalCancel={handleSettingsModalCancel}/>
        {Array.from(dbData.values()).map((conversation) => (
          <div
            key={conversation.id}
            className="conversations__chat"
            onClick={() => onChangeConversation(conversation.id,conversation.promote)}
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