export function download(data) {
  return fetch('http://43.240.98.24:5555/export/phenopackets', {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
}

export function uploadText(data) {
  return fetch('http://phenotyper.monarchinitiative.org:5555/cr/annotate', {
      method: 'POST',
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
}
export default { download, uploadText };