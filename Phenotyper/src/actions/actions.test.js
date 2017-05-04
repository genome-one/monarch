import pdfObj from '../json/pdf.json';
import sortedPdf from '../json/sortedPdf.json';

import * as patientAction from './patient-action.js';
import * as hpoAction from './hpo-action.js';
import * as paragraphAction from './paragraph-action.js';

describe('Actions test case:', () => {
  /********** 
  **** Test case for patient action ************
  ***********/
  describe('Patient action list', () => {
    it('add new patient action', () => {
      const addPatient = {
        'type': 'ADD_PATIENT',
        'date': new Date().toString(),
        'name': 'patient 1',
        'lastestID': 1
      }
      let addAction = patientAction.addPatients('patient 1', 1);
      expect(addAction).toEqual(addPatient);  
    });

    it('remove patient action', () => {
      const removePatient = {
        'type': 'REMOVE_PATIENT',
        'name': 'patient 1',
      }
      let removeAction = patientAction.removePatient('patient 1');
      expect(removeAction).toEqual(removePatient);  
    });

    it('get patient action', () => {
      const getPatient = {
        'type': 'GET_PATIENT',
        'data': {'name':'patient', 'id': 1},
      }
      let getAction = patientAction.getPatients({'name':'patient', 'id': 1});
      expect(getAction).toEqual(getPatient);  
    });

    it('add patient mutation action', () => {
      const newMutation = 
      {
        id: 1,
        value: 'aaa'
      }
      const patient = {'name':'patient', 'id': 1};
      const addPatientMutation = {
        type: 'ADD_PATIENT_MUTATION',
        patientData: patient,
        mutationData: newMutation
      }
      let addPatientMutationAction = patientAction.addPatientMutation(patient, 'aaa', 0);
      expect(addPatientMutationAction).toEqual(addPatientMutation);  
    });

  });

  /********** 
  **** Test case for hpo action ************
  ***********/
  describe('Hpo action list', () => {
    it('get hpo action', () => {
      const hpo = {
        type: 'GET_HPO',
        data: sortedPdf
      }
      let getHpoAction = hpoAction.getHpo(pdfObj);
      expect(getHpoAction).toEqual(hpo);

      const emptyHpo = {
        type: 'GET_HPO',
        data: []
      }
      let getEmptyHpoAction = hpoAction.getHpo([]);
      expect(getEmptyHpoAction).toEqual(emptyHpo);    
    });

    it('add hpo action', () => {
      const hpo = {
        type: 'ADD_HPO',
        label: 'aaa',
        uri: 'hp001',
        lastestID: 1,
      }
      let addHpoAction = hpoAction.addHpo('hp001', 'aaa', 1);
      expect(addHpoAction).toEqual(hpo);  
    });

    it('validate function should work', () => {
      let hpoData = [];
      let sortedHpo = [];
      let data = pdfObj;
      const hpoUri = data.map((hpo) => {
        return hpo.annotation.term.uri;
      })
      sortedHpo = hpoAction.getDuplicatedUri(hpoUri.sort());
      expect(sortedHpo.length).toEqual(12); 
      data.map((hpo, index)=>
      {
        hpoAction.validateHPO(hpo.annotation.term.uri, sortedHpo, hpo, hpoData);
      })
      expect(hpoData).toEqual(sortedPdf);  
    });
  });

  /********** 
  **** Test case for paragraph action ************
  ***********/
  describe('paragraph action list', () => {
    it('get paragraph action', () => {
      const paragraph = {
        type: 'GET_PARAGRAPH',
        data: pdfObj
      }
      let getParagraphAction = paragraphAction.getParagraphs(pdfObj);
      expect(getParagraphAction).toEqual(paragraph);  
    });

    it('remove paragraph action', () => {
      const paragraph = {
        type: 'REMOVE_PARAGRAPH',
        id: 12
      }
      let getParagraphAction = paragraphAction.removeParagraphs(12);
      expect(getParagraphAction).toEqual(paragraph);  
    });
  });
});