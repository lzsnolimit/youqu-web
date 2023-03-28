import {useEffect, useState} from 'react'
import {createStore, get, keys} from 'idb-keyval';

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array and the `addMessage` function.
 */
const useMessageCollection = () => {
    const initialMsg = {
        createdAt: Date.now(),
        content: '**Hello!** *How can I help you today?*',
        ai: true
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