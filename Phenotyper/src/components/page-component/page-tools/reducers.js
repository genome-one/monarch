export function setInputState(state, {name, value}) {
  return Object.assign({}, state, {
    [name]: value
  });
}

export function validateState(state, value) {
  return Object.assign({}, state, { 
    validationState: value
  });
}

export function setToolState(state, name) {
  if(name === 'showTool') {
    return Object.assign({}, state, {
      showTool: !state.showTool
    });
  }
  else {
    return Object.assign({}, state, {
      showList: !state.showList
    });
  }
}

export default { 
  setInputState,
  validateState,
  setToolState
};