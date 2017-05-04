/********** PhenoPacket patient ********/
import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import Types from '../Types';
import PatientHeader from './page-patient-header';
import AddNewVariant from '../page-tools/page-add-variant-tool';
// import AddNewPatientHPO from '../page-tools/page-add-patient-hpo';

/***
*** drop function to add hpo to selected patient on drop
**/
const PatientTarget = {
  drop(props, monitor) 
  {
  	props.handleAddPatientHPO(props.paragraphID, props.uri, props.hpoLabel, props.patient.id);
  }
};

function collect(connect, monitor) {
  return {
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
  };
}
/***
*** Patient component will has 2 properties: hpo(green) and mutation(blue)
*** should not contain duplicated properties
**/
class PatientGrid extends Component {
	render() {
		let uriBody = this.props.patient.hpo.map((uri) => {
			return <PatientHPO uri={uri} key={uri.id}/>;  
		});
		let mutationBody = this.props.patient.mutation.map((mutation) => {
			return <PatientMutation mutation={mutation} key={mutation.id}/>;  
		});

		const {connectDropTarget} = this.props;
		const backgroundCondition = this.props.isOver ? '1px dashed #26b36c' : '';
		var style = {
			border: backgroundCondition
		}
		return connectDropTarget(
			<div className="patient-container col-md-5 col-sm-5 col-xs-6 flipInX animated">
				<PatientHeader patient={this.props.patient}/>
				<div style={style} className="patient-body col-md-12 ">
					{uriBody}
					{mutationBody}
				</div>
				<div className="col-md-12 patient-footer">
					<div className="patient-footer-wrapper">
						<AddNewVariant patient={this.props.patient}/>
						<div className="patient-footer-btn patient-footer-btn-right">Send to Phenopackets.org</div>
					</div>
				</div>
			</div>
		);	
	}
}

PatientGrid.propTypes = {
	connectDropTarget: PropTypes.func.isRequired
};

/*
* hpo drop component
*/
const PatientHPO = (props) => {
	return(
		<div className="col-md-10 col-sm-10 col-md-offset-1 col-sm-offset-1 patient-hpo-container patient-hpo-style ">
			<span className="patient-hpo"> 
				{props.uri.label} 
			</span>
			<span className="patient-hpo"> ({props.uri.uri}) </span>
		</div>
	);
}

/*
* mutation component
*/
const PatientMutation = (props) => {
	return(
		<div className="col-md-10 col-sm-10 col-md-offset-1 col-sm-offset-1 patient-mutation-container patient-mutation-style ">
			<span className="patient-hpo"> 
				{props.mutation.value} 
			</span>
		</div>
	);
}



export default DropTarget(Types.HPO, PatientTarget,collect)(PatientGrid);



