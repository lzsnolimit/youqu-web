import {clear, createStore} from 'idb-keyval';

const messagesStore = new createStore("messages", "messages");

const conversationsStore = new createStore('conversations', 'conversations');

export async function clearAllMessages() {
    try {
        await clear(messagesStore);
        await clear(conversationsStore);
        console.log('所有消息已成功清除');
    } catch (error) {
        console.error('清除消息时出错:', error);
    }
}

export {messagesStore, conversationsStore}