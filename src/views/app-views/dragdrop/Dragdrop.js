import PageHeader from 'components/layout-components/PageHeader'
import React, { useState, useEffect } from 'react'
import { Button, Input } from 'antd'
import { isEqual } from 'lodash'

const offset = { x: 150, y: 60 } // lazy, can be calculated in useEffect

export const Dragdrop = () => {
  const [cardList, setCardList] = useState([])

  const [start, setStart] = useState([null, null])
  const [fieldWidth, setFieldWidth] = useState(600)
  const [fieldHeight, setFieldHeight] = useState(350)
  const [tempWidth, setTempWidth] = useState(600)
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
    setStart({ x, y })
  }

  const dragEndHandler = (e) => {
    const offsetX = e.clientX - start.x
    const offsetY = e.clientY - start.y

    const newCards = structuredClone(cardList)
    const index = newCards.map((el) => el.id).indexOf(Number(e.target.id))
    const card = newCards[index]
    const x = Math.max(0, Math.min(card.x + offsetX, fieldWidth - card.width - 10))
    const y = Math.max(0, Math.min(card.y + offsetY, fieldHeight - card.height - 8))
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

  const handleAddElement = () => {
    const id =
      cardList
        .map((el) => el.id)
        .sort((a, b) => a - b)
        .at(-1) + 1 || 1
    const newCards = structuredClone(cardList)
    newCards.push({ id, x: 0, y: 0, text: id, width: 150, height: 70 })
    setCardList(newCards)
  }

  const handleSaveChart = () => {
    cardList.length
      ? localStorage.setItem('dragdropchart', JSON.stringify(cardList))
      : localStorage.removeItem('dragdropchart')
    setChanges(false)
  }

  console.log(23, fieldHeight, tempHeight)

  const handleClearChart = () => setCardList([])

  const style = { width: 120, textAlign: 'center' }

  return (
    <>
      <PageHeader display={true} title="sidenav.menu.dragdrop" />
      <div style={{ display: 'flex', fledDirection: 'row' }}>
        <div className="dim-inputs">
          Width:
          <Input
            placeholder={fieldWidth}
            value={tempWidth}
            style={style}
            onChange={(e) => setTempWidth(Number(e.target.value))}
          />
          Height:
          <Input
            placeholder={fieldHeight}
            value={tempHeight}
            style={style}
            onChange={(e) => setTempHeight(Number(e.target.value))}
          />
          <Button
            style={style}
            disabled={fieldWidth === tempWidth && fieldHeight === tempHeight}
            onClick={handleSaveDimensions}
          >
            Save size
          </Button>
          <hr style={style} />
          <Button disabled={!changes} style={style} onClick={handleSaveChart}>
            Save chart
          </Button>
          <Button style={style} disabled={!cardList.length} onClick={handleClearChart}>
            Clear chart
          </Button>
          <Button style={style} onClick={handleAddElement}>
            Add elem
          </Button>
        </div>
        <div className="field" style={{ width: fieldWidth, height: fieldHeight }}>
          {cardList.map((card) => {
            const { id, x, y, text } = card
            return (
              <div
                style={{ left: x + offset.x, top: y + offset.y }}
                id={id}
                className="card"
                onDragStart={dragStartHandler}
                onDragEnd={dragEndHandler}
                draggable={true}
                key={id}
              >
                {`id: ${text}, x: ${x}, y: ${y}`}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Dragdrop
