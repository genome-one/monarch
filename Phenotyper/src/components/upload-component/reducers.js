export function setUploadState(state, fileStatus, loaderStatus) {
  return Object.assign({}, state, {
    fileStatus: fileStatus,
    loaderStatus: loaderStatus
  })
}

export function setTextState(state, name, value) {
  return Object.assign({}, state, {
    [name]: value
  })
}

export function cleanState(state) {
  return Object.assign({}, state, {
    uploadText: '',
    uploadContent: '',
    fileStatus: 'removed',
    loaderStatus: ''
  })
}