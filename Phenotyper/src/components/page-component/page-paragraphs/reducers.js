/*
* Set style state for paragraph list
*/
export function setStyleState(state, paragraphStyle, hpoStyle) {
  return Object.assign({}, state, {
    paragraphStyle: paragraphStyle,
    hpoStyle: hpoStyle
  })
}