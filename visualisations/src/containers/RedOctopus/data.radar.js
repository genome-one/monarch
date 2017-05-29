export function initRadarAxisData(classifications) {
  var cArr = [];
  classifications.forEach((item) => {
    cArr.push({axis: item, value: 0})
  })

  return cArr;
}
  
export function countForRadar(axis, data) {
  var arr = JSON.parse(JSON.stringify(axis)); //Deep cloning an array of objects.
  data.phenotypes.forEach((pheno) => {
    pheno.phenotype.classification.forEach((classification) => {
      arr.forEach((item) => {
        if(item.axis === classification.name) {
          item.value++;
        }
      });
    });
  });
 
  return arr;
}

export function sortRadarAxisByTableData(currentRadarData, sortedTableData) {
  var newRadarData = [[],[]];
  sortedTableData.forEach((category) => {
    currentRadarData[0].forEach((item, index) => {
      if(item.axis === category.label) {
        newRadarData[0].push(currentRadarData[0][index]);
        newRadarData[1].push(currentRadarData[1][index]);
      }
    })
  });
  
  return newRadarData;
}