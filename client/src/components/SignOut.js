import {MdClear, MdOutlineLogout} from 'react-icons/md';
import {clearAllMessages} from "../common/storage";
import {useCookies} from "react-cookie";


const Signout = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['Authorization']);
    const signOut = async () => {
        console.log("Sign out")
        removeCookie('Authorization')
    }
    return (
        <div className="nav">
            <span className="nav__item" onClick={signOut}>
              <div className="nav__icons">
                <MdOutlineLogout/>
              </div>
              <h1>Sign out</h1>
            </span>
        </div>
    )
}

export default Signout;