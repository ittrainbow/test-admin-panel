const offset = { x: 128, y: 96 } // done lazy, can be calculated in useEffect

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

export const getCardImg = (size) => {}
