import React, { useState } from 'react'
import { Button, Input, notification, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { saveAs } from 'file-saver'

import PageHeader from 'components/layout-components/PageHeader'
import * as TYPES from 'redux/constants/DragDrop'
import { getCard, useCards } from './Cards'
import './DragDrop.css'

export const DragDrop = () => {
  const dispatch = useDispatch()
  const { cardList, fieldWidth, fieldHeight } = useSelector((store) => store.dragdrop)
  const [tempWidth, setTempWidth] = useState(fieldWidth)
  const [tempHeight, setTempHeight] = useState(fieldHeight)

  const handleSaveDimensions = () => {
    const width = Math.max(Math.min(tempWidth || fieldWidth, 900), 100)
    const height = Math.max(Math.min(tempHeight || fieldHeight, 450), 100)
    setTempWidth(width)
    setTempHeight(height)

    dispatch({ type: TYPES.DD_SET_FIELD, payload: { width, height } })
  }

  const handleAddElement = (e) => dispatch({ type: TYPES.DD_ADD_ELEMENT, payload: getCard({ e, cardList }) })

  const handleClearChart = () => dispatch({ type: TYPES.DD_CLEAR_CHART })

  const { changes, cards, thumbs } = useCards()

  const handleSaveChartToLocalStorage = () => {
    cardList.length
      ? localStorage.setItem('dragdropchart', JSON.stringify(cardList))
      : localStorage.removeItem('dragdropchart')
    notification.open({
      message: 'Table chart saved',
      description: `Saved to browser localStorage as 'dragdropchart' item`,
      placement: 'top',
      onClick: () => notification.close(),
      duration: 2
    })
  }

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

  const handleSaveFile = () => {
    const json = new Blob([JSON.stringify(cardList)], { type: 'application/json' })
    saveAs(json, `export-${new Date().getTime()}.json`)
  }

  const handleLoadFile = (e) => {
    const refArray = ['id', 'x', 'y', 'size', 'width', 'height']
    const uploadedJSON = JSON.parse(e.target.result)
    const check = [...new Set(uploadedJSON.map((el) => Object.keys(el).sort((a, b) => a - b)))]
      .map((el) => el.join('') === refArray.join(''))
      .reduce((a, b) => a && b)
    check && dispatch({ type: TYPES.DD_LOAD_ELEMENTS, payload: uploadedJSON })
  }

  const saveSizeDisabled = fieldWidth === tempWidth && fieldHeight === tempHeight

  return (
    <>
      <PageHeader display={true} title="sidenav.menu.dragdrop" />
      <div className="dragdrop-container">
        <div className="dim-inputs">
          <Input value={`Width: ${tempWidth}`} className="card-button" onChange={handleTempWidth} />
          <Input value={`Height: ${tempHeight}`} className="card-button" onChange={handleTempHeight} />
          <Button className="card-button" disabled={saveSizeDisabled} onClick={handleSaveDimensions}>
            Save size
          </Button>
          <hr className="card-button" />
          <Button className="card-button" disabled={!changes} onClick={handleSaveChartToLocalStorage}>
            Save chart
          </Button>
          <Button className="card-button" disabled={!cardList.length} onClick={handleClearChart}>
            Clear chart
          </Button>
          <hr className="card-button" />
          <Button className="card-button" onClick={handleSaveFile}>
            Save file
          </Button>
          <Upload
            accept=".json"
            showUploadList={false}
            beforeUpload={(file) => {
              const reader = new FileReader()
              reader.onload = (e) => handleLoadFile(e)
              reader.readAsText(file)
              return false
            }}
          >
            <Button className="card-button" icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
        </div>

        <div className="buttons-container">
          {thumbs.map((thumb) => {
            const { src, text, element } = thumb
            return (
              <Button key={text} className="card-button-big" onClick={() => handleAddElement(element)}>
                {text}
                <img src={src} width={75} alt={text} />
              </Button>
            )
          })}
        </div>

        {cards}
      </div>
    </>
  )
}

export default DragDrop
