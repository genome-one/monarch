export function getPhenotypeClassifications(dataArr) {
  var cArr = [];
  dataArr.forEach((data) => {
    data.phenotypes.forEach((pheno) => {
      var dupe = false;
      pheno.phenotype.classification.forEach((classification) => {
        cArr.forEach((item) => {
          if(item === classification.name) {
            dupe = true;
          }
        });

        if(!dupe) cArr.push(classification.name)
      });
    });
  });

 return cArr;
}

export function initClassedPhenotype(classifications) {
  var obj = {};
  classifications.forEach((item) => {
    obj[item] = [];
  })
  
  return obj;
}

export function populateClassedPhenotype(dataObj, data) {
  var newObj = JSON.parse(JSON.stringify(dataObj)); //Deep cloning an array of objects.
  data.phenotypes.forEach((pheno) => {
    pheno.phenotype.classification.forEach((classification) => {
      if(newObj[classification.name]) newObj[classification.name].push(pheno.phenotype);
    });
  });
 
  return newObj;
}