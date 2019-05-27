import React from 'react'

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

export default FontSettingsPopup
