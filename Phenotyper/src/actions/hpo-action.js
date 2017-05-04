/* eslint-disable */

// validate each hpo obj through sorted hpo array
// if it has same uri then push it to new obj
export function validateHPO(uri, sortedHpo, hpo, hpoData)
{
  sortedHpo.map((duplicateUri, index) =>
  {
    if(duplicateUri === uri)
    {
      sortedHpo.splice(index, 1);
      if(hpoData.length !== hpo.length 
        || hpoData.length < hpo.length)
      {
        hpoData.push(hpo);
      }
    }
  })
}

// return hpo array without duplicated hpo
export function getDuplicatedUri(sortedHpo)
{
  const duplicatedUri = sortedHpo.filter((hpo, index, secondHpo) => {
    if(index >= 0 && hpo !== secondHpo[index-1])
    {
      return hpo;
    }
  })
  return duplicatedUri;
}

// if data is not empty then do the validation
// else clean the data
export function getHpo(data) 
{
  let hpoData = [];
  let sortedHpo = [];
  if(data.length !== 0)
  {
    //get uri from paragraph
    // sort it and store it 
    const hpoUri = data.map((hpo) => {
      return hpo.annotation.term.uri;
    })
    sortedHpo = getDuplicatedUri(hpoUri.sort());
    //validate duplicated HPO
    data.map((hpo)=>
    {
      validateHPO(hpo.annotation.term.uri, sortedHpo, hpo, hpoData);
    })
  }
  else
  {
    hpoData = data;
  }
  
  return {
    type: 'GET_HPO',
    data: hpoData
  }
}

export function addHpo(uri, label, lastestID)
{
  return {
    type: 'ADD_HPO',
    label: label,
    uri: uri,
    lastestID: lastestID, 
  }
}