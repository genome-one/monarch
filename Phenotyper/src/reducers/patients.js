//validate function for checking if user enters a same mutation or not
// if it's same mutation then remove it + mutationCheck + 1
// else mutationCheck = 0 and add new mutation
var mutationCheck = 0;
function validateDuplicateMutation(patient, mutationObj, value)
{
  for(var i = 0; i < mutationObj.length; i++)
  {
    if(mutationObj[i].value === value)
    {
      mutationCheck++;
      patient.mutation.splice(i, 1);
      return mutationCheck;
    }
    else
    {
      mutationCheck = 0;
    }
  }
}

//patient has an objact state
export function patient(state, action) 
{
  switch (action.type) {
    case 'ADD_PATIENT':
      return {
        id: action.lastestID +1,
        name: action.name,
        status: "",
        hpo: [],
        mutation:[],
        date: action.date,
      };
    case 'ADD_PATIENT_MUTATION':
      if(state.id === action.patientData.id)
      {
        if(state.mutation.length === 0)
        {
          state.mutation.push(action.mutationData);
        }
        else
        {
          validateDuplicateMutation(state, state.mutation, action.mutationData.value);
          if(mutationCheck === 0)
          {
            mutationCheck++;
            state.mutation.push(action.mutationData);
          }
        }
      }
      return state;
    default:
      return state;
  }
}

//patients list
function patients(state = [], action) 
{
  switch (action.type) {
    case 'GET_PATIENT':
      return action.data;
    case 'ADD_PATIENT':
      state = state.filter(patient => patient.name !== action.name);
      return [
        ...state,
        patient(state, action)
      ];
    case 'REMOVE_PATIENT':
      return state.filter(patient => patient.name !== action.name);
    case 'ADD_PATIENT_MUTATION':
      return state.map( p =>
          patient(p, action)
        );
    default:
      return state;
  }
}

export default patients;
