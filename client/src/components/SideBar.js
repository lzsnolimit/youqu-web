import React, {useEffect, useState} from 'react'
import {MdClose, MdMenu} from 'react-icons/md'
import DarkMode from './DarkMode'
import Conversations from "./Conversations";
import ClearAllConversations from "./ClearAllConversations";

/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
const SideBar = () => {
    const [open, setOpen] = useState(true)
    // const [, , clearMessages] = useContext(ChatContext)
    /**
     * Toggles the dark mode.
     */
    // const clearChat = () => clearMessages()
    const SignOut = () => {
        // clearChat()
        window.sessionStorage.clear()
    }
    useEffect(() => {
        const mediaWidth = window.innerWidth
        if(mediaWidth<576) {
            setOpen(false)
        }
    },[])


    return (
        <section className={` ${open ? "w-72" : "w-20 "} sidebar`}>
            <div className="sidebar__app-bar">
                <div className={`sidebar__app-logo ${!open && "scale-0 hidden"}`}>
                    <span className='w-8 h-8'><img src='https://api.iconify.design/emojione/robot-face.svg?width=24'
                                                   alt=""/></span>
                </div>
                <h1 className={`sidebar__app-title ${!open && "scale-0 hidden"}`}>
                    有趣-Chatbot
                </h1>
                <div className='sidebar__btn-close' onClick={() => setOpen(!open)}>
                    {open ? <MdClose className='sidebar__btn-icon'/> : <MdMenu className='sidebar__btn-icon'/>}

                </div>
            </div>
            {/*<div className="nav">*/}
            {/*  <span className='nav__item  bg-light-white' onClick={clearChat}>*/}
            {/*    <div className='nav__icons'>*/}
            {/*      <MdAdd />*/}
            {/*    </div>*/}
            {/*    <h1 className={`${!open && "hidden"}`}>New chat</h1>*/}
            {/*  </span>*/}
            {/*</div>*/}

            <div className="nav__bottom">
                <Conversations/>
                <DarkMode open={open}/>
                <ClearAllConversations></ClearAllConversations>
                {/*<div className="nav">*/}
                {/*    <a href='https://github.com/EyuCoder/chatgpt-clone' className="nav__item">*/}
                {/*        <div className="nav__icons">*/}
                {/*            <MdOutlineQuestionAnswer/>*/}
                {/*        </div>*/}
                {/*        <h1 className={`${!open && "hidden"}`}>Update & FAQ</h1>*/}
                {/*    </a>*/}
                {/*</div>*/}
                {/*      <div className="nav">*/}
                {/*<span className="nav__item" onClick={SignOut}>*/}
                {/*  <div className="nav__icons">*/}
                {/*    <MdOutlineLogout/>*/}
                {/*  </div>*/}
                {/*  <h1 className={`${!open && "hidden"}`}>Log out</h1>*/}
                {/*</span>*/}
                {/*      </div>*/}
            </div>
        </section>
    )
}

export default SideBar