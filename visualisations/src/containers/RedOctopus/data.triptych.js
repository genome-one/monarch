export function initTriptychData(classedPhenoA, classedPhenoB, select) {
  var selectedA = [], selectedB = [];
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
  
  return { selectedA: selectedA, selectedB: selectedB };
}

export function generateTriptychQueryString(selectedA, selectedB) {
  var hpoA = selectedA.map((item) => { return item.hpoId });
  var hpoB = selectedB.map((item) => { return item.hpoId });
  var qString = '?a=' + hpoA.join('&a=') + '&b=' + hpoB.join('&b=');

  return qString;
}

 export function processDataForTriptych(data, profileNameA, profileNameB, allDataA, allDataB, radarData) {
  var newArr = [],
      maxMaxIC = data.results[0].system_stats.maxMaxIC;
  data.results[0].matches.forEach((match) => {
    newArr.push({
      [profileNameA]: { label: match.a.label, informationContent: parseFloat(match.a.IC).toFixed(2) },
      [profileNameB]: { label: match.b.label, informationContent: parseFloat(match.b.IC).toFixed(2) },
      lcs: { label: match.lcs.label, informationContent: parseFloat(match.lcs.IC).toFixed(2) },
      similarity: calSimScore(match.a.IC, match.b.IC, match.lcs.IC, maxMaxIC)
    });
  })
  
  newArr.sort((a, b) => {
    return b.similarity - a.similarity;
  });
   
  newArr = includeUnmatch(newArr, profileNameA, profileNameB, allDataA, allDataB);
  newArr = categoriseDataForTriptych(newArr, radarData);
    
  return newArr;
}
 
export function includeUnmatch(data, profileNameA, profileNameB, allDataA, allDataB) {
  var newData = data;
  
  allDataA.forEach((itemA) => {
    var have = false;
    
    newData.forEach((item) => {
      if(item[profileNameA].label === itemA.name) have = true;
    });
    
    if(!have) {
      newData.push({
        [profileNameA]: { label: itemA.name, informationContent: 0 },
        [profileNameB]: { label: '', informationContent: 0 },
        similarity: 0
      })
    }
  });
  
  allDataB.forEach((itemB) => {
    var have = false;
    
    newData.forEach((item) => {
      if(item[profileNameB].label === itemB.name) have = true;
    });
    
    if(!have) {
      newData.push({
        [profileNameA]: { label: '', informationContent: 0 },
        [profileNameB]: { label: itemB.name, informationContent: 0 },
        similarity: 0
      })
    }
  });
  
  return newData;
}

export function categoriseDataForTriptych(triptychData, radarData) {
  var newData = {};
  radarData[0].forEach((item) => {
    newData[item.axis] = [];
  });
  
  triptychData.forEach((item) => {
    var itemHaveA = item[Object.keys(item)[0]],
        itemNoA = item[Object.keys(item)[1]];
     
    if(itemHaveA.label !== "") {
      radarData[0].forEach((rData) => {
        rData.list.forEach((lItem) => {
          if(lItem === itemHaveA.label) newData[rData.axis].push(item); 
        })
      });
    } else {
      radarData[1].forEach((rData) => {
        rData.list.forEach((lItem) => {
          if(lItem === itemNoA.label) newData[rData.axis].push(item); 
        })
      });
    } 
  });

  return newData;
}

export function calSimScore(aIC, bIC, lcsIC, maxMaxIC ) {
  var distance = Math.sqrt(Math.pow(aIC - lcsIC, 2) 
      + Math.pow(bIC - lcsIC, 2)); 
  var similarity = parseFloat((1 - (distance / maxMaxIC)) * 100).toFixed(1);

  return similarity;
}