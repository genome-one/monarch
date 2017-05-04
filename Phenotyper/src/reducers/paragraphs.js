//paragraphs list
function paragraphs(state = [], action) 
{
  switch (action.type) {
    case 'GET_PARAGRAPH':
      return action.data;
    case 'REMOVE_PARAGRAPH':
      return state.filter(paragraph => paragraph.id !== action.id);
    default:
      return state;
  }
}

export default paragraphs;
