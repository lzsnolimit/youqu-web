import {MdClear} from 'react-icons/md';
import {clearAllMessages} from "../common/storage";
import useLocalStorage, {SelectedConversation} from "../hooks/useLocalStorage";


const ClearAllConversations = () => {
    const [storeConversation, setStoreConversation,removeItem] = useLocalStorage(SelectedConversation, '');

    const clearAll = async () => {
        await clearAllMessages()
        await removeItem()
        window.location.reload(true)
    }
    return (
        <div className="nav">
            <span className="nav__item" onClick={clearAll}>
              <div className="nav__icons">
                <MdClear/>
              </div>
              <h1>Clear All Conversations</h1>
            </span>
        </div>
    )
}

export default ClearAllConversations;