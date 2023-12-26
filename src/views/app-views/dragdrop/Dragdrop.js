import PageHeader from 'components/layout-components/PageHeader'
import React, { useState, useEffect } from 'react'
import { Button, Input, notification } from 'antd'
import { isEqual } from 'lodash'

import { getCard, getCardStyle } from './Cards'
import './DragDrop.css'

export const DragDrop = () => {
  const [cardList, setCardList] = useState([])
  const [dragStart, setDragStart] = useState([null, null])
  const [fieldWidth, setFieldWidth] = useState(700)
  const [fieldHeight, setFieldHeight] = useState(350)
  const [tempWidth, setTempWidth] = useState(700)
  const [tempHeight, setTempHeight] = useState(350)
  const [changes, setChanges] = useState(false)

  useEffect(() => {
    const cards = localStorage.getItem('dragdropchart')
    cards && setCardList(JSON.parse(cards))
  }, [])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dragdropchart')) || []
    const equal = isEqual(cardList, stored)
    setChanges(!equal)
  }, [cardList])

  const dragStartHandler = (e) => {
    const x = e.clientX
    const y = e.clientY
    setDragStart({ x, y })
  }

  const dragEndHandler = (e) => {
    const offsetX = e.clientX - dragStart.x
    const offsetY = e.clientY - dragStart.y

    const newCards = structuredClone(cardList)
    const index = newCards.map((el) => el.id).indexOf(Number(e.currentTarget.id))
    const card = newCards[index]
    const x = Math.max(0, Math.min(card.x + offsetX, fieldWidth - card.width - 10))
    const y = Math.max(0, Math.min(card.y + offsetY, fieldHeight - card.height - 10))
    const movingCard = { ...card, x, y }

    newCards[index] = movingCard
    setCardList(newCards)
  }

  const handleSaveDimensions = () => {
    const newWidth = Math.max(Math.min(tempWidth || fieldWidth, 900), 100)
    const newHeight = Math.max(Math.min(tempHeight || fieldHeight, 450), 100)
    setFieldWidth(newWidth)
    setTempWidth(newWidth)
    setFieldHeight(newHeight)
    setTempHeight(newHeight)
  }

  const handleAddElement = (e) => {
    const card = getCard({ e, cardList })
    const newCards = structuredClone(cardList)
    newCards.push(card)
    setCardList(newCards)
  }

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

  const handleClearChart = () => setCardList([])

  const handleRemoveElem = (id) => {
    const newCards = structuredClone(cardList).filter((card) => card.id !== id)
    setCardList(newCards)
  }

  const style = { width: 100, textAlign: 'center' }

  const tempWidthHandler = (e) => {
    const { value } = e.target
    const num = value.split(' ').at(-1)
    num && setTempWidth(num)
  }

  const tempHeightHandler = (e) => {
    const { value } = e.target
    const num = value.split(' ').at(-1)
    num && setTempHeight(num)
  }

  const saveSizeDisabled = fieldWidth === tempWidth && fieldHeight === tempHeight

  return (
    <>
      <PageHeader display={true} title="sidenav.menu.dragdrop" />
      <div style={{ display: 'flex', fledDirection: 'row' }}>
        <div className="dim-inputs">
          <Input value={`Width: ${tempWidth}`} style={style} onChange={tempWidthHandler} />
          <Input value={`Height: ${tempHeight}`} style={style} onChange={tempHeightHandler} />
          <Button disabled={saveSizeDisabled} onClick={handleSaveDimensions}>
            Save size
          </Button>
          <hr style={style} />
          <Button disabled={!changes} onClick={handleSaveChart}>
            Save chart
          </Button>
          <Button disabled={!cardList.length} onClick={handleClearChart}>
            Clear chart
          </Button>
        </div>
        <div className="field-container">
          <div className="buttons-container">
            <Button onClick={() => handleAddElement('small')}>Add small table</Button>
            <Button onClick={() => handleAddElement('medium')}>Add medium table</Button>
            <Button onClick={() => handleAddElement('large')}>Add large table</Button>
          </div>
          <div className="field" style={{ width: fieldWidth, height: fieldHeight }}>
            {cardList.map((card) => {
              const { id, size } = card
              const src = `/img/chairs/${size}.png`
              return (
                <div
                  style={getCardStyle(card)}
                  id={id}
                  className="card"
                  onDragStart={dragStartHandler}
                  onDragEnd={dragEndHandler}
                  draggable={true}
                  key={id}
                >
                  <img src={src} style={{ zIndex: 2 * id }} />
                  <div
                    className="card-remove"
                    onClick={() => handleRemoveElem(id)}
                    style={{ zIndex: 2 * id + 1, position: 'absolute' }}
                  >
                    remove
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default DragDrop
