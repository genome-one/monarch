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