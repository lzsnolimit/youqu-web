import {useEffect, useMemo, useState} from 'react'
import {get, keys} from 'idb-keyval';
import {MESSAGE_TYPE} from '../common/constant'
import store from '../common/storage'
import {ulid} from 'ulid'


const useMessageCollection = () => {
    const initialMsg = {
        createdAt: Date.now(),
        messageID:ulid(),
        content: '你好，我是话痨机器人，有什么问题你可以直接问我。另外你还可以发送"#菜单"查看我支持的指令。',
        ai: true,
        type: MESSAGE_TYPE.INTRODUCTION,
    };

    const initialMap = useMemo(
        () => new Map([[initialMsg.messageID, initialMsg]]),
        [initialMsg]
    );

    const [messages, setMessages] = useState(initialMap);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const messageKeys = await keys(store);
                const fetchedMessages = await Promise.all(
                    messageKeys.map(async (messageID) => {
                        const value = await get(messageID, store);
                        return [messageID, value];
                    })
                );
                const newMessages = new Map([ ...fetchedMessages,...initialMap]);
                setMessages(newMessages);
            } catch (error) {
                console.error('Error fetching all messages:', error);
                setMessages(initialMap);
            }
        };
        loadMessages();
    }, []);


    const clearMessages = () => setMessages(new Map(initialMap));

    return [messages, setMessages, clearMessages];
};

export default useMessageCollection;