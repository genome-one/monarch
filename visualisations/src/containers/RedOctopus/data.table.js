export function initTableData(classifications) {
  var cArr = [];
  classifications.forEach((item) => {
    cArr.push({label: item, matchScore: 0, diseaseA: 0, diseaseB: 0})
  })
  
  return {
    diseaseAName: '',
    diseaseBName: '',
    overall: { matchScore: 0, diseaseA: 0, diseaseB: 0 },
    list: cArr 
  };
}

export function populateTableData(dataObj, prop, data) {
  dataObj[prop + 'Name'] = data.name;
                                                        
  data.phenotypes.forEach((pheno) => {
    pheno.phenotype.classification.forEach((classification) => {
      dataObj.list.forEach((item) => {
        if(item.label === classification.name) {
          item[prop]++;
          dataObj.overall[prop]++;
        }
      });
    });
  });
 
  return dataObj;
}