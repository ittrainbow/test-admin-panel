import { useSelector } from 'react-redux'

const offset = { x: 120, y: 96 } // done lazy, can be calculated in useEffect

export const getCard = ({ e: size, cardList }) => {
  const id =
    cardList
      .map((el) => el.id)
      .sort((a, b) => a - b)
      .at(-1) + 1 || 1

  const card = { id, x: 0, y: 0, size }

  switch (size) {
    case 'small':
      return { ...card, width: 125, height: 75 }

    case 'medium':
      return { ...card, width: 120, height: 110 }

    case 'large':
      return { ...card, width: 160, height: 125 }

    default:
      break
  }
}

export const getCardStyle = (card) => {
  const { width, height, x, y, id } = card

  return { left: x + offset.x, top: y + offset.y, width, height, zIndex: 2 * id }
}

export const useCards = ({ handleDragStart, handleDragEnd, handleRemoveElem }) => {
  const { cardList, fieldWidth, fieldHeight } = useSelector((store) => store.dragdrop)

  return (
    <div className="field" style={{ width: fieldWidth, height: fieldHeight }}>
      {cardList.map((card) => {
        const { id, size } = card
        const src = `/img/chairs/${size}.png`
        return (
          <div
            style={getCardStyle(card)}
            id={id}
            className="card"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggable={true}
            key={id}
          >
            <img src={src} alt={id} style={{ zIndex: 2 * id }} />
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
  )
}
