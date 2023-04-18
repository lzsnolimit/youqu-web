import React, { useContext } from 'react';
import useIndexedDB from "../hooks/useIndexedDB";
import { conversationsStore } from "../common/storage";
import { ulid } from "ulid";
import useLocalStorage, { SelectedConversationIdKey } from "../hooks/useLocalStorage";
import { ChatContext } from "../context/chatContext";

const Conversations = () => {
  const [_, setStoreConversationId] = useLocalStorage(SelectedConversationIdKey, '');
  const {dbData , saveDataToDB} = useIndexedDB(conversationsStore);

  const {selectedConversationId, setSelectedConversationId} = useContext(ChatContext);


  const onAddChat = () => {
    const id = ulid();
    const initCV = {
      id,
      title: 'New chat',
      createdAt: Date.now(),
    }

    setSelectedConversationId(id);
    saveDataToDB(initCV);
  }

  const onChangeConversation = (conversation) => {
    setStoreConversationId(conversation.id);
    setSelectedConversationId(conversation.id);
  }

  return(
    <>
      <div className="conversations">
        <div className="conversations__add_chat" onClick={onAddChat}>+ New chat</div>
        {Array.from(dbData.values()).map((conversation) => (
          <button
            key={conversation.id}
            className="conversations__chat"
            style={{background: selectedConversationId === conversation.id && '#343541'}}
            onClick={() => onChangeConversation(conversation)}
          >
            {conversation.title}
          </button>
        ))}
      </div>
    </>
  )
}

export default Conversations;