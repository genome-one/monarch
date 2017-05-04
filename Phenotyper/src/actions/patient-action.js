/*
* add new patient
*/
export function addPatients(name, lastestID) 
{
  return {
    type: 'ADD_PATIENT',
    date: new Date().toString(),
    name: name,
    lastestID:lastestID
  }
}

/*
* remove selected patient based on patient name
*/
export function removePatient(name)
{
  return {
    type: 'REMOVE_PATIENT',
    name: name
  }
}
/*
* return patients data
*/
export function getPatients(data) {
  return {
    type: 'GET_PATIENT',
    data: data
  }
}

/*
* add new mutation data for selected patient
*/

export function addPatientMutation(patient, mutationData, mutationID)
{
  const newMutation = 
  {
    id: mutationID + 1,
    value: mutationData
  }

  return {
    type: 'ADD_PATIENT_MUTATION',
    patientData: patient,
    mutationData: newMutation
  }
}