import React, { useContext } from 'react';
import { ulid } from "ulid";
import useLocalStorage, { SelectedConversationIdKey } from "../hooks/useLocalStorage";
import { ChatContext } from "../context/chatContext";
import ConversationIcons from "./ConversationIcons";

const Conversations = () => {
  const [_, setStoreConversationId, removeItem] = useLocalStorage(SelectedConversationIdKey, '');
  const {selectedConversationId, setSelectedConversationId, conversationsContext, messagesContext} = useContext(ChatContext);
  const {dbData, saveDataToDB, deleteDataById} = conversationsContext;
  const {dbData: messagesDbData , deleteManyByIds} = messagesContext;


  const onAddConversation = () => {
    const id = ulid();
    const initCV = {
      id,
      title: 'New chat',
      createdAt: Date.now(),
    }

    onChangeConversation(id)
    saveDataToDB(initCV);
  }

  const onChangeConversation = (id) => {
    setStoreConversationId(id);
    setSelectedConversationId(id);
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
        <div className="conversations__add_chat" onClick={onAddConversation}>+ New chat</div>
        {Array.from(dbData.values()).map((conversation) => (
          <div
            key={conversation.id}
            className="conversations__chat"
            onClick={() => onChangeConversation(conversation.id)}
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