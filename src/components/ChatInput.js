/* globals mp */
import React, { useState, useEffect, useRef } from 'react'

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

    deactivateInput()
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

  function deactivateInput () {
    setValue('')
    setHistoryId(0)
    mp.invoke('focus', false)
    setInputActive(false)
  }

  if (!inputActive) return null

  return (
    <form className={"dayrp-chat__form"} onSubmit={chatSubmit}>
      <input className="dayrp-chat__input" ref={inputEl} onChange={updateValue} onKeyDown={processChatInput} type="text" name="replay" value={value} autoFocus/>
    </form>
  )
}

export default ChatInput
