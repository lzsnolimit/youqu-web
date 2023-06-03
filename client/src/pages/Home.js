import SideBar from '../components/SideBar';
import ChatView from '../components/ChatView';
import React, {useEffect, useState} from 'react'
import useIndexedDB from "../hooks/useIndexedDB";
import {conversationsStore} from "../common/storage";
import useLocalStorage, {SelectedConversation} from "../hooks/useLocalStorage";
import {ChatContextProvider} from "../context/chatContext";
import {useCookies} from "react-cookie";
import useSocketIO from "../hooks/useSocketIO";

const Home = () => {

    const conversationsContext = useIndexedDB(conversationsStore);
    const {dbData: conversationsDbData , saveDataToDB: saveConversationsToDB} = conversationsContext;

    const [storeConversation, setStoreConversation] = useLocalStorage(SelectedConversation, '');

    const [user, setUser] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(
        storeConversation && storeConversation !== ''
            ? JSON.parse(storeConversation)
            : null
    );
    const [cookies, removeCookie] = useCookies(['Authorization']);
    const [socketRef,sendMessage] = useSocketIO(); // 更改此行



    useEffect(() => {
        //convert conversation to string and save in localstorage
        if (currentConversation == null)
            return
        setStoreConversation(JSON.stringify(currentConversation));
        console.log("currentConversation changed to: " + JSON.stringify(currentConversation))
    }, [currentConversation])



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


    return (
            <ChatContextProvider
                value={{
                    conversationsContext,
                    socketRef,
                    sendMessage,
                    user,
                    setUser,
                    currentConversation,
                    setCurrentConversation,

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