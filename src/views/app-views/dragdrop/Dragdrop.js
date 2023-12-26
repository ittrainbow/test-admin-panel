import React, { useState, useEffect } from 'react'
import { Button, Input, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEqual } from 'lodash'

import PageHeader from 'components/layout-components/PageHeader'
import * as TYPES from 'redux/constants/DragDrop'
import { getCard, getCardStyle, useCards } from './Cards'
import './DragDrop.css'

export const DragDrop = () => {
  const dispatch = useDispatch()
  const { cardList, fieldWidth, fieldHeight } = useSelector((store) => store.dragdrop)
  const [tempWidth, setTempWidth] = useState(700)
  const [tempHeight, setTempHeight] = useState(350)
  const [changes, setChanges] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dragdropchart')) || []
    const equal = isEqual(cardList, stored)
    setChanges(!equal)
  }, [cardList])

  const handleSaveDimensions = () => {
    const width = Math.max(Math.min(tempWidth || fieldWidth, 900), 100)
    const height = Math.max(Math.min(tempHeight || fieldHeight, 450), 100)
    setTempWidth(width)
    setTempHeight(height)

    dispatch({ type: TYPES.DD_SET_FIELD, payload: { width, height } })
  }

  const handleAddElement = (e) => dispatch({ type: TYPES.DD_ADD_ELEMENT, payload: getCard({ e, cardList }) })

  const handleClearChart = () => dispatch({ type: TYPES.DD_CLEAR_CHART })

  const handleRemoveElem = (id) => dispatch({ type: TYPES.DD_REMOVE_ELEMENT, payload: id })

  const handleDragStart = (e) => dispatch({ type: TYPES.DD_MOVE_START, payload: { e } })

  const handleDragEnd = (e) => dispatch({ type: TYPES.DD_MOVE_END, payload: { e } })

  const cards = useCards({ handleDragStart, handleDragEnd, handleRemoveElem })

  const handleSaveChart = () => {
    cardList.length
      ? localStorage.setItem('dragdropchart', JSON.stringify(cardList))
      : localStorage.removeItem('dragdropchart')
    setChanges(false)
    notification.open({
      message: 'Table chart saved',
      description: `Saved to browser localStorage as 'dragdropchart' item`,
      placement: 'top',
      onClick: () => notification.close(),
      duration: 2
    })
  }

  const style = { width: 100, textAlign: 'center' }

  const handleTempWidth = (e) => {
    const { value } = e.target
    const num = value.split(' ').at(-1)
    num && setTempWidth(num)
  }

  const handleTempHeight = (e) => {
    const { value } = e.target
    const num = value.split(' ').at(-1)
    num && setTempHeight(num)
  }

  const handleSaveFile = () => {}

  const handleLoadFile = () => {}

  const saveSizeDisabled = fieldWidth === tempWidth && fieldHeight === tempHeight

  return (
    <>
      <PageHeader display={true} title="sidenav.menu.dragdrop" />
      <div style={{ display: 'flex', fledDirection: 'row' }}>
        <div className="dim-inputs">
          <Input value={`Width: ${tempWidth}`} style={style} onChange={handleTempWidth} />
          <Input value={`Height: ${tempHeight}`} style={style} onChange={handleTempHeight} />
          <Button style={style} disabled={saveSizeDisabled} onClick={handleSaveDimensions}>
            Save size
          </Button>
          <hr style={style} />
          <Button style={style} disabled={!changes} onClick={handleSaveChart}>
            Save chart
          </Button>
          <Button style={style} disabled={!cardList.length} onClick={handleClearChart}>
            Clear chart
          </Button>
          <hr style={style} />
          <Button style={style} onClick={handleSaveFile}>
            Save file
          </Button>
          <Button style={style} onClick={handleLoadFile}>
            Load file
          </Button>
        </div>
        <div className="field-container">
          <div className="buttons-container">
            <Button onClick={() => handleAddElement('small')}>Add small table</Button>
            <Button onClick={() => handleAddElement('medium')}>Add medium table</Button>
            <Button onClick={() => handleAddElement('large')}>Add large table</Button>
          </div>
          {cards}
        </div>
      </div>
    </>
  )
}

export default DragDrop
