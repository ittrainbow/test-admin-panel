import React, { useState, useEffect } from 'react'
import { Button, Input, notification, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { isEqual } from 'lodash'
import { saveAs } from 'file-saver'

import PageHeader from 'components/layout-components/PageHeader'
import * as TYPES from 'redux/constants/DragDrop'
import { getCard, useCards } from './Cards'
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

  const handleSaveChartToLocalStorage = () => {
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

  const handleSaveFile = () => {
    const json = new Blob([JSON.stringify(cardList)], { type: 'application/json' })
    saveAs(json, 'export.json')
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
      <div style={{ display: 'flex', fledDirection: 'row' }}>
        <div className="dim-inputs">
          <Input value={`Width: ${tempWidth}`} style={style} onChange={handleTempWidth} />
          <Input value={`Height: ${tempHeight}`} style={style} onChange={handleTempHeight} />
          <Button style={style} disabled={saveSizeDisabled} onClick={handleSaveDimensions}>
            Save size
          </Button>
          <hr style={style} />
          <Button style={style} disabled={!changes} onClick={handleSaveChartToLocalStorage}>
            Save chart
          </Button>
          <Button style={style} disabled={!cardList.length} onClick={handleClearChart}>
            Clear chart
          </Button>
          <hr style={style} />
          <Button style={style} onClick={handleSaveFile}>
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
            <Button style={style} icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
        </div>

        <div className="buttons-container-col">
          <Button onClick={() => handleAddElement('small')}>Add small table</Button>
          <Button onClick={() => handleAddElement('medium')}>Add medium table</Button>
          <Button onClick={() => handleAddElement('large')}>Add large table</Button>
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
