import { getComparedAttributeSets } from './apis';

export function clustering(dataA, dataB) {
  let clusters = [];
  
  const isBone = (phenotype) => {
    return phenotype.classification.map(classification => classification.id).indexOf('#13:7130') >= 0;
  }
  
  const a = dataA.phenotypes.filter(phenotype => isBone(phenotype.phenotype)).map((phenotype) => phenotype.phenotype.hpoId );
  const b = dataB.phenotypes.filter(phenotype =>  isBone(phenotype.phenotype)).map((phenotype) => phenotype.phenotype.hpoId );
  
  const set = a.concat(b).reduce(function(acc, id) {
    return acc.indexOf(id) >= 0 ? acc : acc.concat([id])
  }, []);
  

  const owlsimRequests = set.reduce((acc, hpoId, index) => {
    return acc.then(() => makeCall(set, index));
  }, Promise.resolve());

  return owlsimRequests.then((test) => {
    // now to make the clusters
    const superClusters = clusters.reduce((acc, match) => {
      // us term a, or term b, in anotehr cluster already?
      const existingClusters = acc.filter(match2 => {
        const ids = match2.terms.map(term => term.id);
        return ids.indexOf(match.a.id) >= 0 ||
          ids.indexOf(match.b.id) >= 0
      });
      
      if (existingClusters.length) {
        var dupeA = false, dupeB = false;
        existingClusters[0].terms.forEach((term) => {
          if(term.id === match.a.id) dupeA = true;
          if(term.id === match.b.id) dupeB = true;
        })
        
        if(!dupeA) existingClusters[0].terms.push(match.a);
        if(!dupeB) existingClusters[0].terms.push(match.b);
        
        if(match.lcs.IC < existingClusters[0].lcs.IC) {
          existingClusters[0].lcs = match.lcs;
        }
        
        return acc;
      }
      
      acc.push({
        lcs: match.lcs,
        terms: [match.a, match.b]
      });
      
      return acc;
    }, []);
    
    return superClusters;
  });
  
  function makeCall(set, index) {
    const setWithout = [...set];
    setWithout.splice(index, 1);
    const qString = `?a=${set[index]}` + setWithout.map(hpoId => `&b=${hpoId}`).join('');

    return getComparedAttributeSets(qString)
      .then(json => {
        json.results[0].matches.forEach(match => {
          clusters.push(match);
        });
        return json.results[0].matches;
      }).catch(e => console.log(e));
  }
}

export function generateAxisData(clusteredData, dataA, dataB) {
  const a = dataA.phenotypes.map((phenotype) => phenotype.phenotype.hpoId );
  const b = dataB.phenotypes.map((phenotype) => phenotype.phenotype.hpoId );
  var nArr = [[],[]];
  
  clusteredData.forEach((cluster, index) => {
    nArr[0][index] = { axis: cluster.lcs.label, value: 0, list: [] };
    nArr[1][index] = { axis: cluster.lcs.label, value: 0, list: [] };
    
    cluster.terms.forEach((term) => {
      a.forEach((aId) => {
        if(term.id === aId) {
          nArr[0][index].value++;
          nArr[0][index].list.push(term.label);
        }
      });
      
      b.forEach((bId) => {
        if(term.id === bId) {
          nArr[1][index].value++;
          nArr[1][index].list.push(term.label);
        }
      }); 
    });
  });
  
  return nArr;
}

export function groupSimilar(axisData) {
  var aGroups = [[],[],[]], bGroups = [[],[],[]];
  var i, al = axisData[0].length;
  
  // Seperate axis into 3 groups
  for(i=0;i<al;i++) {
    if(axisData[0][i].value === 0 && axisData[1][i].value > 0) {
      aGroups[0].push(axisData[0][i]);
      bGroups[0].push(axisData[1][i]);
    }
    
    if(axisData[0][i].value > 0 && axisData[1][i].value > 0) {
      aGroups[1].push(axisData[0][i]);
      bGroups[1].push(axisData[1][i]);
    }
    
    if(axisData[0][i].value > 0 && axisData[1][i].value === 0) {
      aGroups[2].push(axisData[0][i]);
      bGroups[2].push(axisData[1][i]);
    }
  }
  
  // Concat the results
  var aGroup = aGroups[0].concat(aGroups[1],aGroups[2]),
      bGroup = bGroups[0].concat(bGroups[1],bGroups[2]);

  return [aGroup, bGroup];
}