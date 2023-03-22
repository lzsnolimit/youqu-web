import React, { useState, useRef, useEffect, useContext } from 'react'
import ChatMessage from './ChatMessage'
import { ChatContext } from '../context/chatContext'
import Thinking from './Thinking'

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef()
  const inputRef = useRef()
  const [formValue, setFormValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const options = ['ChatGPT', 'DALL·E']
  const [selected, setSelected] = useState(options[0])
  const [messages, addMessage] = useContext(ChatContext)

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, selected,ai = false,requestType="text",reponseType="text") => {
    const id = Date.now() + Math.floor(Math.random() * 1000000)
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`
    }

    addMessage(newMsg)
    const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    storedMessages.push(newMsg)
    localStorage.setItem('messages', JSON.stringify(storedMessages))
  }

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault()

    const newMsg = formValue
    const aiModel = selected

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const PATH = aiModel === options[0] ? 'chat' : 'dalle'
    const POST_URL = BASE_URL + PATH

    setThinking(true)
    setFormValue('')
    updateMessage(newMsg, aiModel, false)

    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        "dataType": "json",
      },
      body: JSON.stringify({
        msg: newMsg,
        "id": "23de6e55-77b5-4d3d-b7de-ee4f7644f24a",
        "response_type":"text",
        "request_type":"text"
      }),
      credentials: 'include'
    })

    const data = await response.json()

    console.log(response.status)
    if (response.ok) {
      // The request was successful
      data.result && updateMessage(data.result, aiModel, true)

    } else if (response.status === 429) {
      setThinking(false)
    } else {
      // The request failed
      window.alert(`openAI is returning an error: ${response.status + response.statusText} 
      please try again later`)
      console.log(`Request failed with status code ${response.status}`)
      setThinking(false)
    }

    setThinking(false)
  }

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom()
  }, [messages, thinking])

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const initRows = 2;
  const maxTextAreaHeight = 130;
  const adjustHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, maxTextAreaHeight) + 'px';
  };

  return (
    <div className="chatview">
      <main className='chatview__chatarea'>

        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </main>
      <form className='form' onSubmit={sendMessage}>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="dropdown" >
          <option>{options[0]}</option>
          <option>{options[1]}</option>
        </select>
        <textarea ref={inputRef} rows={initRows} className='chatview__textarea-message' value={formValue} onChange={(e) => {
          setFormValue(e.target.value);
          adjustHeight(e);
        }} onKeyDown={(e) => {
          if (e.shiftKey && e.keyCode === 13) {
            e.preventDefault()
            sendMessage(e)
          }
        }} />
        <button type="submit" className='chatview__btn-send' disabled={!formValue}>Send</button>
      </form>
    </div>
  )
}

export default ChatView