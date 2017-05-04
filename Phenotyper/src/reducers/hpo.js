//newHpo has an objact state
export function newHpo(state, action) {
  switch (action.type) {
    case 'ADD_HPO':
      return {
        id: action.lastestID + 1, 
        text:'',
        annotation:{end_offset:'', length:'', negated:'', original_text: action.label, source:'', 
        start_offset:'', term:{preferredLabel: action.label, synonyms:[], uri: action.uri}}
      };
    default:
      return state;
  }
}

//paragraphs list
function hpo(state = [], action)  {
  switch (action.type) {
    case 'GET_HPO':
      return action.data;
    case 'ADD_HPO':
      state = state.filter(hpo => 
      (hpo.annotation.term.uri !== action.uri || hpo.annotation.term.preferredLabel !== action.label));
      return [
        ...state,
        newHpo(state, action)
      ];
    default:
      return state;
  }
}

export default hpo;
