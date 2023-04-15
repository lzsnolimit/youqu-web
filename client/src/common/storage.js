import {clear, createStore} from 'idb-keyval';

const store = new createStore("messages", "messages");

export async function clearAllMessages() {
    try {
        await clear(store);
        console.log('所有消息已成功清除');
    } catch (error) {
        console.error('清除消息时出错:', error);
    }
}

export default store;