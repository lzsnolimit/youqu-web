import SideBar from '../components/SideBar';
import ChatView from '../components/ChatView';
import React, {useEffect, useState} from 'react'
import useIndexedDB from "../hooks/useIndexedDB";
import {conversationsStore} from "../common/storage";
import useLocalStorage, {SelectedConversationIdKey} from "../hooks/useLocalStorage";
import {ChatContextProvider} from "../context/chatContext";
import {useCookies} from "react-cookie";
import UserContext from "../context/userContext";
import {json} from "react-router-dom";
import useSocketIO from "../context/useSocketIO";
import userContext from "../context/userContext"; // 更改此行
const Home = () => {
    // const [cookies, setCookie, removeCookie] = useCookies(['Authorization']);
    // useEffect(() => {
    //     if (cookies.Authorization == null) {
    //         window.location.href = '/login';
    //     }
    // }, [cookies]);

    const conversationsContext = useIndexedDB(conversationsStore);
    // const messagesContext = useIndexedDB(messagesStore, initialMsg);
    const {dbData: conversationsDbData , saveDataToDB: saveConversationsToDB} = conversationsContext;
    const [storeConversationId, setStoreConversationId] = useLocalStorage(SelectedConversationIdKey, '');
    const [selectedConversationId, setSelectedConversationId] = useState('')
    const [selectedSystemPromote,setSelectedSystemPromote]=useState('')

    const [initLoadConversationsIsDone, setInitLoadConversationsIsDone] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [cookies, removeCookie] = useCookies(['Authorization']);
    const socketRef = useSocketIO(); // 更改此行



    useEffect(() => {
        setSelectedConversationId(storeConversationId);
    }, [storeConversationId])


    useEffect(() => {
        // 示例代码：从API获取用户数据并设置状态
        async function fetchUserData() {
            try {
                const response = await fetch(process.env.REACT_APP_BASE_URL + 'get_user_info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 添加你的认证token（如果有）作为请求头
                        // 'Authorization': `Bearer ${yourAuthToken}`,
                    },
                    body: JSON.stringify({  // 如果需要的话，可以添加请求体
                        'token': cookies.Authorization
                    })
                });
                const userData = await response.json();
                if (response.ok) {
                    setUser(userData);
                } else {
                    console.error('Error fetching user data:', userData);
                    removeCookie('Authorization')
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                removeCookie('Authorization')
            }
        }
        if (user == null)
        {
            fetchUserData();
        }
    }, []);


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
                    socketRef,
                    user,
                    setUser,
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