import Home from './pages/Home'
import {ChatContextProvider} from './context/chatContext'
import React, { useEffect, useState } from 'react';
import {useCookies} from 'react-cookie';
import { ulid } from "ulid";
import useIndexedDB, { initialMsg } from "./hooks/useIndexedDB";
import { conversationsStore, messagesStore } from "./common/storage";
import useLocalStorage, { SelectedConversationIdKey } from "./hooks/useLocalStorage";

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['id','Authorization']);
    useEffect(() => {

        if (cookies.id == null) {
            if (process.env.REACT_APP_ENV == "development"){
                const uuid='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                setCookie("id",uuid)
            }
            else {
                removeCookie("id");
                removeCookie("Authorization");
                window.location.href = '/login';
            }

        }
    }, [cookies]);

    const conversationsContext = useIndexedDB(conversationsStore);
    const messagesContext = useIndexedDB(messagesStore, initialMsg);
    const {dbData: conversationsDbData , saveDataToDB: saveConversationsToDB} = conversationsContext;
    const [storeConversationId, setStoreConversationId] = useLocalStorage(SelectedConversationIdKey, '');
    const [selectedConversationId, setSelectedConversationId] = useState('')

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
        }, 300)
    }, [conversationsDbData.size])

    /**
     * If the data obtained in indexedDB is empty, an initial value is set
     */
    useEffect(() => {
        if(!initLoadConversationsIsDone || conversationsDbData.size > 0) {
            return;
        }
        setSaveLoading(true);
        const id = ulid();
        saveConversationsToDB({id, title: 'New chat', createAt: Date.now()})
          .then(() => setStoreConversationId(id))
          .finally(() => setSaveLoading(false));
    }, [initLoadConversationsIsDone])


    return (
        <ChatContextProvider value={{selectedConversationId, setSelectedConversationId, conversationsContext, messagesContext}}>
           {console.log("Start app")}
            <div>
                {/* TODO  loading page  */}
                {saveLoading ? 'loading...' : <Home />}
            </div>
        </ChatContextProvider>
    )
}


export default App