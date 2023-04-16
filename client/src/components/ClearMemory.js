import {MdClear} from 'react-icons/md';
import {clearAllMessages} from "../common/storage";


const ClearMemory = () => {

    const clearAll = async () => {
        await clearAllMessages()
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

export default ClearMemory;