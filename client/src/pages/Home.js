import SideBar from '../components/SideBar';
import ChatView from '../components/ChatView';
import React, {useEffect, useState} from 'react'
import useIndexedDB from "../hooks/useIndexedDB";
import {conversationsStore} from "../common/storage";
import useLocalStorage, {SelectedConversationIdKey} from "../hooks/useLocalStorage";
import {ChatContextProvider} from "../context/chatContext";

const Home = () => {

    const conversationsContext = useIndexedDB(conversationsStore);
    // const messagesContext = useIndexedDB(messagesStore, initialMsg);
    const {dbData: conversationsDbData , saveDataToDB: saveConversationsToDB} = conversationsContext;
    const [storeConversationId, setStoreConversationId] = useLocalStorage(SelectedConversationIdKey, '');
    const [selectedConversationId, setSelectedConversationId] = useState('')
    const [selectedSystemPromote,setSelectedSystemPromote]=useState('')

    const [initLoadConversationsIsDone, setInitLoadConversationsIsDone] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        setSelectedConversationId(storeConversationId);
    }, [storeConversationId])

    /**
     * The initialization waits for the data in indexedDB to be asynchronously fetched
     */
    useEffect(() => {
        setTimeout(() => {
            setInitLoadConversationsIsDone(true)
            Array.from(conversationsDbData.values()).map((conversation) => {
                if (conversation.id==selectedConversationId){
                    setSelectedSystemPromote(conversation.promote)
                }
            })
        }, 300)
    }, [conversationsDbData.size])



    return (
        <ChatContextProvider
            value={{
                selectedConversationId,
                setSelectedConversationId,
                conversationsContext,
                selectedSystemPromote,
                setSelectedSystemPromote,
            }}
        >
            {console.log("Start home")}

        <div className="flex transition duration-500 ease-in-out">
            <SideBar/>
            <ChatView/>
        </div>
        </ChatContextProvider>
    )
}

export default Home