import {
  DD_ADD_ELEMENT,
  DD_CLEAR_CHART,
  DD_MOVE_START,
  DD_MOVE_END,
  DD_REMOVE_ELEMENT,
  DD_SET_FIELD,
  DD_LOAD_ELEMENTS
} from 'redux/constants/DragDrop'

const nullDragStart = { x: 0, y: 0 }

const initialState = {
  cardList: JSON.parse(localStorage.getItem('dragdropchart')) || [],
  dragStart: nullDragStart,
  fieldWidth: 700,
  fieldHeight: 350,
  changes: false
}

const dragdrop = (state = initialState, action) => {
  const { payload } = action
  switch (action.type) {
    case DD_LOAD_ELEMENTS:
      return {
        ...state,
        cardList: payload
      }

    case DD_ADD_ELEMENT:
      const newCardsAdd = structuredClone(state.cardList)
      newCardsAdd.push(payload)
      return { ...state, cardList: newCardsAdd }

    case DD_REMOVE_ELEMENT:
      const newCardsRemove = structuredClone(state.cardList).filter((card) => card.id !== payload)
      return { ...state, cardList: newCardsRemove }

    case DD_MOVE_START:
      return { ...state, dragStart: { x: payload.e.clientX, y: payload.e.clientY } }

    case DD_MOVE_END:
      const { e } = payload
      const { clientX, clientY } = e
      const offsetX = clientX - state.dragStart.x
      console.log(191, state.dragStart)
      const offsetY = clientY - state.dragStart.y
      const newCardsMove = structuredClone(state.cardList)
      const index = newCardsMove.map((el) => el.id).indexOf(Number(e.currentTarget.id))
      const card = newCardsMove[index]
      const x = Math.max(0, Math.min(card.x + offsetX, state.fieldWidth - card.width - 10))
      const y = Math.max(0, Math.min(card.y + offsetY, state.fieldHeight - card.height - 10))
      const movingCard = { ...card, x, y }
      newCardsMove[index] = movingCard

      return {
        ...state,
        dragStart: nullDragStart,
        cardList: newCardsMove
      }

    case DD_CLEAR_CHART:
      return { ...state, cardList: [] }

    case DD_SET_FIELD:
      return {
        ...state,
        fieldWidth: payload.width,
        fieldHeight: payload.height
      }

    default:
      return state
  }
}
export default dragdrop
