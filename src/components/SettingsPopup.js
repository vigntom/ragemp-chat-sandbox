import React, { useState } from 'react'
import FontSettingsPopup from './FontSettingsPopup'

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

export default SettingsPopup
