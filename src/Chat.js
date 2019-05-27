/* globals mp, EventManager */
import React, { useState, useEffect, useRef } from 'react'
import RndChat from './RndChat'
import './Chat.scss'


function FontSettingsPopup ({ isActive, setFont, fontSize, closePopups }) {
  if (!isActive) return null

  const allowedFontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  function getHandler (fontSize) {
    return function handler (event) {
      setFont(fontSize)
      closePopups()
    }
  }

  function FontOption ({ size }) {
    const isActiveClass = (size === fontSize) ? ' isActive' : ''
    return (
      <li className={"font-size__option" + isActiveClass}>
        <button className="ghost-btn" onClick={getHandler(size)}>{size}px</button>
      </li>
    )
  }

  return (
    <ul className={"font-size__settings"}>
      { allowedFontSizes.map((size) => <FontOption key={size.toString()} size={size}/>) }
    </ul>
  )
}

function SettingsPopup ({ isActive, settings, closePopup, setOption }) {
  const [isFontsPopup, setIsFontsPopup] = useState(false)
  const setFont = setOption('fontSize')
  const fontSize = settings.fontSize

  function toggleFontsPopup (event) {
    return setIsFontsPopup(!isFontsPopup)
  }

  function closePopups () {
    toggleFontsPopup()
    closePopup()
  }

  if (!isActive) return null

  return (
    <ul className="dayrp-chat__settings">
      <li className="dayrp-chat__option-group option-group">
        <h3 className="option-group__name">Графика</h3>
        <button className="option-group__item ghost-btn" onClick={toggleFontsPopup}>Размер шрифта</button>
        <FontSettingsPopup isActive={isFontsPopup} fontSize={fontSize} closePopups={closePopups} setFont={setFont}/>
      </li>
    </ul>
  )
}

function ChatInput ({ inputActive, setInputActive }) {
  const commandHistoryLength = 50
  const [value, setValue] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyId, setHistoryId] = useState(0)
  const inputEl = useRef(null)

  function removeExtraWhitespaces (text) {
    return text.replace(/\s+/g, ' ').trim()
  }

  function moveCursorToEnd (el, length) {
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = length
    }, 0)
  }

  function sendCommand (command) {
    mp.invoke('command', command)

    const result = [...commandHistory, command]
    const excess = result.length - commandHistoryLength

    if (excess > 0) {
      return setCommandHistory(result.slice(excess))
    }

    return setCommandHistory(result)
  }

  function chatSubmit (event) {
    event.preventDefault()

    if (value.length > 1 && value[0] === '/') {
      sendCommand(removeExtraWhitespaces(value.substr(1)))
    }

    mp.invoke('chatMessage', value)

    setInputActive(false)
    setValue('')
    setHistoryId(0)
    mp.invoke('focus', false)
  }

  function updateValue (event) {
    setValue(event.target.value)
  }

  function processChatInput (event) {
    if (!inputActive) return

    if (event.keyCode === 38) showPreviousFromLast()
    if (event.keyCode === 40) showPreviousFromFirst()
  }

  function showPreviousFromLast () {
    const size = commandHistory.length

    if (size === 0) return
    setHistoryId((historyId - 1 + size) % size)

    const result = `/${commandHistory[historyId]}`
    setValue(result)
    moveCursorToEnd(inputEl.current, result.length)
  }

  function showPreviousFromFirst () {
    const size = commandHistory.length

    if (size === 0) return
    setHistoryId((historyId + 1) % size)

    const result = `/${commandHistory[historyId]}`
    setValue(result)
    moveCursorToEnd(inputEl.current, result.length)
  }

  if (!inputActive) return null

  return (
    <form className={"dayrp-chat__form"} onSubmit={chatSubmit}>
      <input className="dayrp-chat__input" ref={inputEl} onChange={updateValue} onKeyDown={processChatInput} type="text" name="replay" value={value} autoFocus/>
    </form>
  )
}

function DayRPChat ({ toggleActive }) {
  const chatHistoryLength = 100
  const defaultSettings = {
    fontSize: 12,
    channels: [
      { name: 'server', color: 'orange' },
      { name: 'faction', color: 'blue' },
      { name: 'branch', color: 'green' }
    ]
  }
  const [isSettings, setIsSettings] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)
  const [inputActive, setInputActive] = useState(false)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    function onMessage (message) {
      const result = [...messages, message]
      const excess = result.length - chatHistoryLength

      if (excess > 0) {
        return setMessages(result.slice(excess))
      }

      return setMessages(result)
    }

    function onClear () {
      return setMessages([])
    }

    function onActivate () {
      if (inputActive) return
      mp.invoke('focus', true)
      return setInputActive(!inputActive)
    }

    function onShow () {
      return toggleActive()
    }

    EventManager.subscribe('message', onMessage)
    EventManager.subscribe('clear', onClear)
    EventManager.subscribe('activate', onActivate)
    EventManager.subscribe('show', onShow)

    return function cleanup () {
      EventManager.unsubscribe('message', onMessage)
      EventManager.unsubscribe('clear', onClear)
      EventManager.unsubscribe('activate', onActivate)
      EventManager.unsubscribe('show', onShow)
    }
  })

  function toggleIsSettings (event) {
    return setIsSettings(!isSettings)
  }

  function setOption (option) {
    return value => {
      const params = { [option]: value }

      return setSettings(
        Object.assign({}, settings, params)
      )
    }
  }

  return (
      <div className="dayrp-chat__container" style={{ fontSize: settings.fontSize }}>
        <div className="dayrp-chat__drag-handle">
          <div className="dayrp-chat__control">
            <button className="dayrp-chat__title" onClick={toggleIsSettings}>Общий</button>
            <SettingsPopup isActive={isSettings} settings={settings} closePopup={toggleIsSettings} setOption={setOption}/>
          </div>
        </div>

        <ul className="dayrp-chat">
          {
            messages.map((msg, idx) => (
              <li className="dayrp-chat__msg" key={idx}>{msg}</li>
            ))
          }
        </ul>

        <ChatInput inputActive={inputActive} setInputActive={setInputActive} />
      </div>
  )
}

function Chat () {
  const [chatActive, setChatActive] = useState(true)
  const maybeHidden = chatActive ? '' : ' is-hidden'

  return (
    <div className={"dayrp-chat__wrapper" + maybeHidden}>
      <RndChat dragHandleClassName="dayrp-chat__drag-handle">
        <DayRPChat toggleActive={() => setChatActive(!chatActive)} />
      </RndChat>
    </div>
  )
}

export default Chat
