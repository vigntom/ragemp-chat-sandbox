import React, { useState } from 'react'
import { Rnd } from 'react-rnd'

function RndChat ({children, dragHandleClassName }) {
  const [size, setSize] = useState({ width: 300, height: 150 })
  const [position, setPosition] = useState({ x: 10, y: 10 })

  return (
    <Rnd className="dayrp-chat__rnd-container"
      size = {{ width: size.width, height: size.height }}
      position = {{ x: position.x, y: position.y }}
      onDragStop = { (e, d) => { setPosition({ x: d.x, y: d.y }) }}
      onResize = { (e, direction, ref, delta, position) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight })
        setPosition(position)
      }}
      dragHandleClassName={dragHandleClassName}
    >
      {children}
    </Rnd>
  )
}

export default RndChat
