import sortedPdf from '../json/sortedPdf.json';
import patientObj from '../json/patients.json';
import pdfObj from '../json/pdf.json';

import hpo from '../reducers/hpo.js';
import { newHpo } from '../reducers/hpo.js';
import patients from '../reducers/patients.js';
import { patient } from '../reducers/patients.js';
import paragraphs from '../reducers/paragraphs.js';
import MonarchApp from '../reducers/monarch-store.js';


describe('Reducers test case:', () => {
  /********** 
  **** Test case for hpo reducer ************
  ***********/
  describe('hpo reducer test:', () => {

    it('should return the default state of hpo and newHpo', () => 
    {
      let hpoReducer = hpo([], {}); 
      expect(hpoReducer).toEqual([]);
      let newHpoReducer = newHpo([], {});
      expect(newHpoReducer).toEqual([]);
    })
    it('should return the hpo initial state', () => 
    {
      let action = {
        type: 'GET_HPO', 
        data: sortedPdf
      };
      let hpoReducer = hpo([], action); 
      expect(hpoReducer).toEqual(action.data);
    })

    it('should add and return a new hpo object', () => {
      let newHpoObj = {
        id: 15, 
        text:'',
        annotation:{end_offset:'', length:'', negated:'', original_text: 'aaa', source:'', 
        start_offset:'', term:{preferredLabel: 'aaa', synonyms:[], uri: 'hp001'}}
      }
      let action = {
        type: 'ADD_HPO', 
        label: 'aaa',
        uri: 'hp001',
        lastestID: 14, 
      };

      let duplicatedAction = {
        type: 'ADD_HPO', 
        label: 'aaa',
        uri: 'HP:0009381',
        lastestID: 14, 
      };

      let hpoReducer = hpo(sortedPdf, action);
      expect(hpoReducer[hpoReducer.length - 1]).toEqual(newHpoObj);
      let duplicatedHpoReducer = hpo(sortedPdf, duplicatedAction);
      expect(duplicatedHpoReducer.length).toEqual(13);
      let newHpoReducer = newHpo([newHpoObj], action);
      expect(newHpoReducer).toEqual(newHpoObj);
    })
  });

  /********** 
  **** Test case for patients reducer ************
  ***********/
  describe('patient reducer test:', () => {
    it('should return the default state of patients and patient', () => 
    {
      let patientsReducer = patients([], {}); 
      expect(patientsReducer).toEqual([]);
      let patientReducer = patient([], {}); 
      expect(patientReducer).toEqual([]);
    })
    it('should return the patient initial state', () => 
    {
      let action = {
        type: 'GET_PATIENT', 
        data: patientObj
      };
      let patientReducer = patients([], action); 
      expect(patientReducer).toEqual(action.data);
    })
    it('should add and return a new patient object', () => 
    {
      let today = new Date();
      let options = {
        weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit"
      };
      let day = today.toLocaleDateString("en-us", options);

      let newPatient = {
        id: 6,
        name: 'patient 1',
        status: "",
        hpo: [],
        mutation:[],
        date: day,
      }

      let action = {
        type: 'ADD_PATIENT', 
        date: day,
        name: 'patient 1',
        lastestID: 5 
      };
      let patientReducer = patients(patientObj, action); 
      expect(patientReducer[patientReducer.length - 1]).toEqual(newPatient);
    })
    it('should remove patient', () => {
      let tempPatient = [
        {'id': 0, 'name': 'patient 0'},
        {'id': 1, 'name': 'patient 1'},
      ]
      let remainPatient = [
        {'id': 0, 'name': 'patient 0'},
      ]
      let action = {
        type: 'REMOVE_PATIENT', 
        name: 'patient 1'
      };
      let patientReducer = patients(tempPatient, action); 
      expect(patientReducer).toEqual(remainPatient);
    })
    it('should add new mutation to selected patient', () => 
    {
      const patientData = 
      {  
        "id":0,
        "name":"patient:1",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[],
        "date":""
      }
      const firstPatient = [  
      {  
        "id":0,
        "name":"patient:1",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[{"mutationID":1, "value": "aaa"}],
        "date":""
      },
      {  
        "id":1,
        "name":"patient:2",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[],
        "date":""
      },
      {  
        "id":2,
        "name":"patient:3",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[],
        "date":""
      },
      {  
        "id":3,
        "name":"patient:4",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[],
        "date":""
      }]

      const secondPatient = [  
      {  
        "id":0,
        "name":"patient:1",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[{"mutationID":1, "value": "aaa"}, {"mutationID":2, "value": "bbb"}],
        "date":""
      },
      {  
        "id":1,
        "name":"patient:2",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[],
        "date":""
      },
      {  
        "id":2,
        "name":"patient:3",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[],
        "date":""
      },
      {  
        "id":3,
        "name":"patient:4",
        "status":{"id": "NEW", "preferredLabel": "New"},
        "hpo":[],
        "mutation":[],
        "date":""
      }]
      const firstMutation = 
      {
        mutationID: 1,
        value: "aaa"
      }
      const secondMutation = 
      {
        mutationID: 2,
        value: "bbb"
      }
      const firstAction = {
        type: 'ADD_PATIENT_MUTATION',
        patientData: patientData,
        mutationData: firstMutation
      };
      const secondAction = {
        type: 'ADD_PATIENT_MUTATION',
        patientData: patientData,
        mutationData: secondMutation
      };
      //test case for adding mutation when it's empty
      let patientReducer = patients(patientObj, firstAction); 
      expect(patientReducer).toEqual(firstPatient);
      
      //make sure it will remove the same mutation
      let duplicatePatientMutation = patients(patientObj, firstAction); 
      expect(duplicatePatientMutation[0].mutation).toEqual([]);

      //make sure it will add new mutation if patient doesn't has it
      let multipleMutation = patients(firstPatient, secondAction);
      expect(multipleMutation).toEqual(secondPatient);
    })
  });
  
  /********** 
  **** Test case for paragraphs reducer ************
  ***********/
  describe('paragraphs reducer test:', () => {
    it('should return the default state of paragraphs', () => 
    {
      let paragraphsReducer = paragraphs([], {}); 
      expect(paragraphsReducer).toEqual([]);
    })
    it('should return the paragraphs initial state', () => 
    {
      let action = {
        type: 'GET_PARAGRAPH', 
        data: pdfObj
      };
      let paragraphsReducer = paragraphs([], action); 
      expect(paragraphsReducer).toEqual(action.data);
    })
    it('should remove paragraphs', () => {
      let tempParagraphs = [
      {
        "id":0,
        "text":"... ms (e.g., ‘‘short\nand broad fingers’’ aligns to ‘‘short finger’’ [HP: 0009381] and\n‘‘broad finger’’ [HP: 0001500 ... ",
        "annotation":
        { 
          "start_offset":54, "end_offset":66,"length":12,"original_text":"short finger", "source":"HPO",
          "term":
          { 
            "uri":"HP:0009381","preferredLabel":"Short finger",
            "synonyms":[ "Hypoplastic/small fingers", "Hypoplastic digits", "Stubby finger", "Hypoplastic fingers"]
          },
          "negated":false
        }
      },
      {
        "id":1,
        "text":"... Stokes respiration’’ (MeSH: D002639), which is an\nabnormal breathing pattern that can be observed in diseases\nsuch as  ... ",
        "annotation":
        {
          "start_offset":54, "end_offset":72, "length":18, "original_text":"abnormal breathing", "source":"HPO",
          "term":
          {
            "uri":"HP:0005957",
            "preferredLabel":"Breathing dysregulation",
            "synonyms":
            [
              "Abnormal breathing"
            ]
          },
          "negated":false
        }
      }];

      let remainParagraph = [
      {
        "id":1,
        "text":"... Stokes respiration’’ (MeSH: D002639), which is an\nabnormal breathing pattern that can be observed in diseases\nsuch as  ... ",
        "annotation":
        {
          "start_offset":54, "end_offset":72, "length":18, "original_text":"abnormal breathing", "source":"HPO",
          "term":
          {
            "uri":"HP:0005957",
            "preferredLabel":"Breathing dysregulation",
            "synonyms":
            [
              "Abnormal breathing"
            ]
          },
          "negated":false
        }
      }]
      let action = {
        type: 'REMOVE_PARAGRAPH', 
        id: 0
      };
      let paragraphsReducer = paragraphs(tempParagraphs, action); 
      expect(paragraphsReducer).toEqual(remainParagraph);
    })
  });
});
