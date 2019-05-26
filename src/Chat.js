/* globals mp */
import React, { useState, useEffect } from 'react'
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

function ChatInput ({ isActive, toggle }) {
  const [value, setValue] = useState('')

  function chatSubmit (event) {
    event.preventDefault()
    mp.trigger('foobar', value)
    setValue('')
    return toggle()
  }

  function updateValue (event) {
    setValue(event.target.value)
  }

  if (!isActive) return null

  return (
    <form className={"dayrp-chat__form"} onSubmit={chatSubmit}>
      <input className="dayrp-chat__input" onChange={updateValue} type="text" name="replay" autoFocus/>
    </form>
  )
}

function DayRPChat () {
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

  useEffect(() => {
    document.querySelector('body').addEventListener('keydown', event => {
      if (event.keyCode === 84) {
        event.preventDefault()
        return setInputActive(!inputActive)
      }
    })
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
          <li className="dayrp-chat__msg">[Server] Welcome to DayRP server!</li>
        </ul>

        <ChatInput isActive={inputActive} toggle={() => setInputActive(!inputActive)} />
      </div>
  )
}

function Chat () {
  return (
    <RndChat dragHandleClassName="dayrp-chat__drag-handle">
      <DayRPChat />
    </RndChat>
  )
}

export default Chat
