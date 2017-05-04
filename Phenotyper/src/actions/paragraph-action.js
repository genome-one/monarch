export function getParagraphs(data) {
  return {
    type: 'GET_PARAGRAPH',
    data: data
  }
}

export function removeParagraphs(id) {
  return {
    type: 'REMOVE_PARAGRAPH',
    id: id
  }
}
