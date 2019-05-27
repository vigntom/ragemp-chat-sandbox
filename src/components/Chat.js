import React, { useState, useEffect } from 'react'
import RndChat from './RndChat'
import DayRPChat from './DayRPChat'
import './Chat.scss'

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
