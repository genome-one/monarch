export function generateTriptychQueryString(classedPhenoA, classedPhenoB, select) {
  var selectedA = [], selectedB = []
  if(select) {
    selectedA = classedPhenoA[select];
    selectedB = classedPhenoB[select];
  } else {
    Object.keys(classedPhenoA).forEach((key) => {
      selectedA.push.apply(selectedA, classedPhenoA[key]);
    });
    
    Object.keys(classedPhenoB).forEach((key) => {
      selectedB.push.apply(selectedB, classedPhenoB[key]);
    });
  }

  var hpoA = selectedA.map((item) => { return item.hpoId });
  var hpoB = selectedB.map((item) => { return item.hpoId });
  var qString = '?a=' + hpoA.join('&a=') + '&b=' + hpoB.join('&b=');

  return qString;
}

 export function processDataForTriptych(data, profileNameA, profileNameB) {
  var newArr = [],
      maxMaxIC = data.results[0].system_stats.maxMaxIC;
  data.results[0].matches.forEach((match) => {
    newArr.push({
      [profileNameA]: { label: match.a.label, informationContent: parseFloat(match.a.IC).toFixed(2) },
      [profileNameB]: { label: match.b.label, informationContent: parseFloat(match.b.IC).toFixed(2) },
      similarity: calSimScore(match.a.IC, match.b.IC, match.lcs.IC, maxMaxIC)
    });
  })

  newArr.sort((a, b) => {
    return b.similarity - a.similarity;
  })

  return newArr;
}
  
export function calSimScore(aIC, bIC, lcsIC, maxMaxIC ) {
  var distance = Math.sqrt(Math.pow(aIC - lcsIC, 2) 
      + Math.pow(bIC - lcsIC, 2)); 
  var similarity = parseFloat((1 - (distance / maxMaxIC)) * 100).toFixed(1);

  return similarity;
}