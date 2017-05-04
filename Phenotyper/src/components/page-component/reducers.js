/**
 * set data to page state based on name and value
 */
export function setPageState(state, name, value) {
  return Object.assign({}, state, {
    [name]: value
  })
}

/*
* set state for dragged hpo
*/
export function setHpoDragState(state, paragraphID, uri, hpoLabel) {
  return Object.assign({}, state, {
    uri: uri,
    paragraphID: paragraphID,
    hpoLabel: hpoLabel
  })
}
