import React, { useEffect } from 'react';
import useIndexedDB from "../hooks/useIndexedDB";
import { conversationsStore } from "../common/storage";
import { ulid } from "ulid";

const Conversations = () => {
  const initCV = {
    id: ulid(),
    title: 'New chat',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  const {dbData , saveDataToDB} = useIndexedDB(conversationsStore);
  const conversations = Array.from(dbData.values());

  const onAddChat = () => {
    saveDataToDB(initCV);
  }

  return(
    <>
      <div className="conversations">
        <div className="conversations__new_chat" onClick={onAddChat}>+ New chat</div>
        {conversations.map((conversation) => (
          <div key={conversation.id}>{conversation.title}</div>
        ))}
      </div>
    </>
  )
}

export default Conversations;