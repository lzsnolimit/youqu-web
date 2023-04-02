import {useEffect, useState} from 'react'
import {createStore, get, keys} from 'idb-keyval';
import {COMMANDS, MESSAGE_TYPE} from '../common/constant'

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array and the `addMessage` function.
 */
const useMessageCollection = () => {
    const initialMsg = {
        createdAt: Date.now(),
        content: '你好，我是话痨机器人，有什么问题你可以直接问我。另外你还可以发送"#菜单"查看我支持对指令。',
        ai: true,
        type:MESSAGE_TYPE.INTRODUCTION
    }
    const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    const store = new createStore("youqu.app", "messages");
    useEffect(() => {
        const loadMessages = async () => {
            let storedMessages = []
            try {
                const messageKeys = await keys(store);
                storedMessages = await Promise.all(messageKeys.map((key) => get(key, store)));
                //console.log(storedMessages)
            } catch (error) {
                console.error('Error fetching all messages:', error);
                return [];
            }


            if (storedMessages === undefined) {
                setMessages([initialMsg])
            } else {
                storedMessages.push(initialMsg)
                setMessages(storedMessages);
            }
        }
        loadMessages();
    }, [])

    const [messages, setMessages] = useState(storedMessages);


    /**
     * A function for adding a new message to the collection.
     *
     * @param {Object} message - The message to add to the collection.
     */
    const addMessage = (message) => {
        setMessages((prev) => [...prev, message]);
    }

    const clearMessages = () => setMessages([initialMsg])

    return [messages, addMessage, clearMessages];
}

export default useMessageCollection