import pdfObj from '../json/pdf.json';
import sortedPdf from '../json/sortedPdf.json';
import patientObj from '../json/patient.json';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import Header from '../components/header';
import Footer from '../components/footer';
import { UploadTabComponent } from '../components/upload-component/upload-tab.js';
import { AddNewHPO } from '../components/page-component/page-tools/page-add-hpo-tool.js';
import AddNewPatientHPO  from '../components/page-component/page-tools/page-add-patient-hpo.js';
import { AddNewPatient } from '../components/page-component/page-tools/page-add-patient-tool.js';
import { AddNewVariant } from '../components/page-component/page-tools/page-add-variant-tool.js';
import HpoTool from '../components/page-component/page-tools/page-tools.js';

describe('Components test case:', () => {

  it('Header renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Header/>, div);
  });

  it('Footer renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Footer/>, div);
  });

  it('UploadComponent renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UploadTabComponent/>, div);
  });

  it('AddNewHPO render/functional test: ', () => {
    const AddNewHPOApp = ReactTestUtils.renderIntoDocument(
      <AddNewHPO />
    );
    AddNewHPOApp.handleInputChange({
      target:{
        value: 'label',
        name: 'labelValue'
      }  
    });
    expect(AddNewHPOApp.state.labelValue).toEqual('label');

    AddNewHPOApp.handleInputChange({
      target:{
        value: 'uri',
        name:'uriValue'
      }  
    });
    expect(AddNewHPOApp.state.uriValue).toEqual('uri');
    
    // test if user enter value in uri and label box
    AddNewHPOApp.getHPOValidationState(1,1);
    expect(AddNewHPOApp.state.validationState).toEqual('success');

    AddNewHPOApp.getHPOValidationState(1,0);
    expect(AddNewHPOApp.state.validationState).toEqual('error');

    AddNewHPOApp.handleModalClick();
    expect(AddNewHPOApp.state.hpoShow).toEqual(true);
    expect(AddNewHPOApp.state.validationState).toEqual(null);

  });

  it('AddNewPatientHPO render/functional test: ', () => {
    const AddNewPatientHPOApp = ReactTestUtils.renderIntoDocument(
      <AddNewPatientHPO patient={patientObj} 
        hpoData={sortedPdf} handleAddPatientHPO=''/>
    );

    AddNewPatientHPOApp.handleModalClick();
    expect(AddNewPatientHPOApp.state.hpoShow).toEqual(true);
    
    AddNewPatientHPOApp.handleSelectChange('a');
    expect(AddNewPatientHPOApp.state.hpoValue).toEqual('a');
    //if it work it should return undefined
    //else it will show error
    expect(AddNewPatientHPOApp.handleSubmit()).toEqual(undefined);
  });

  it('AddNewPatient render/functional test: ', () => {
    const AddNewPatientApp = ReactTestUtils.renderIntoDocument(
      <AddNewPatient patientData={patientObj}/>
    );
    AddNewPatientApp.handleModalClick();
    expect(AddNewPatientApp.state.patientShow).toEqual(true);
    expect(AddNewPatientApp.state.validationState).toEqual(null);
    //undefined because of wrong key number but the function is running
    expect(AddNewPatientApp.handleKeyPress({
      which: 12
    })).toEqual(undefined);

    AddNewPatientApp.handleInputChange({
      target:{
        value: 'patient',
        name:'patient'
      }  
    });
    expect(AddNewPatientApp.state.patient).toEqual('patient');

    AddNewPatientApp.getPatientValidationState(1);
    expect(AddNewPatientApp.state.validationState).toEqual('success'); 
    AddNewPatientApp.getPatientValidationState(0);
    expect(AddNewPatientApp.state.validationState).toEqual('error');

  });

  it('AddNewVariant render/functional test: ', () => {
    const AddNewVariantApp = ReactTestUtils.renderIntoDocument(
      <AddNewVariant patient={patientObj}/>
    );

    AddNewVariantApp.handleModalClick();
    expect(AddNewVariantApp.state.variantShow).toEqual(true);
    expect(AddNewVariantApp.state.validationState).toEqual(null);

    AddNewVariantApp.handleInputChange({
      target:{
        value: 'a',
        name:'variant'
      }  
    });
    expect(AddNewVariantApp.state.variant).toEqual('a');

    expect(AddNewVariantApp.handleKeyPress({
      which: 12
    })).toEqual(undefined);

    AddNewVariantApp.getVariantLengthValidationState(1);
    expect(AddNewVariantApp.state.validationState).toEqual('success'); 
    AddNewVariantApp.getVariantLengthValidationState(0);
    expect(AddNewVariantApp.state.validationState).toEqual('error'); 
  });

  it('HpoTool renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<HpoTool/>, div);
  });

});