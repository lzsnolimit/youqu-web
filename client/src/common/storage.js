import {createStore} from 'idb-keyval';

const store = new createStore("messages", "messages");

export default store;