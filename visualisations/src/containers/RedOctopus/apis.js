export function getDiseaseOptions(value) {
  return fetch(`https://scigraph-ontology.monarchinitiative.org/scigraph/vocabulary/search/${value}?limit=20`)
    .then((response) => response.json())
    .then((json) => {
      var arr = [];
      json.forEach((elem) => {
        if(elem.categories[0] === 'disease') {
          arr.push({
            label: elem.labels[0],
            value: elem.curie,
            json: elem
          });
        }
      });

      return { options: arr };
    });
}

export function getComparedAttributeSets(qString) {
  return fetch(`https://crossorigin.me/https://beta.monarchinitiative.org/owlsim/compareAttributeSets${qString}`)
    .then((response) => response.json())
    .then((json) => json)
    .catch(e => console.log(e));
}