import React from 'react';
import PatientGrid from './page-patient-grid';
import PatientList from './page-patient-list';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

/********** PhenoPacket patient grid layout ********/

const Patients = (props) => {
	const patientNode = props.patients.map((patient) => {
		if(props.patientStyle === 'grid') {
			return <PatientGrid patient={patient} key={patient.id}
				uri={props.uri}
				hpoLabel={props.hpoLabel}
				droppedUriContainer={props.droppedUriContainer}
				paragraphID={props.paragraphID} 
				handleAddPatientHPO={props.handleAddPatientHPO}
				hpoData={props.hpoData}/>
		}
		else {
			return <PatientList patient={patient} key={patient.id} 
			uri={props.uri}
			hpoLabel={props.hpoLabel}
			droppedUriContainer={props.droppedUriContainer}
			paragraphID={props.paragraphID} 
			handleAddPatientHPO={props.handleAddPatientHPO}
			hpoData={props.hpoData}
			/>;
		}
	});
	return(
		<div> {patientNode} </div>
	);    
}

export default Patients;
