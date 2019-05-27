/* globals mp, EventManager */
import React, { useState, useEffect } from 'react'
import SettingsPopup from './SettingsPopup'
import ChatInput from './ChatInput'

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
      return setInputActive(true)
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

export default DayRPChat
