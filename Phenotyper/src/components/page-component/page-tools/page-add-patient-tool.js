import React, { Component } from 'react';
import { Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addPatients } from '../../../actions/patient-action.js';
import { setInputState, validateState } from './reducers';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

let createSubmitHandler = function(dispatch) {
  let handlerAddPatient = function(name, lastestID) {
    dispatch(addPatients(name, lastestID));
  };

  return {
    handlerAddPatient  
  };
}
export class AddNewPatient extends Component {
	constructor(props) {
		super(props);
		this.state = {
			patient:'',
			patientShow: false,
			validationState: null
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handler = createSubmitHandler(this.props.dispatch);
		this.handleModalClick = this.handleModalClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleModalClick() {
		this.setState({ patientShow: true, validationState: null});
	}

	handleKeyPress(event) {
    if(event.which === 13) 
    {
      event.preventDefault();
    }
  }

	handleSubmit() {
		this.getPatientValidationState(this.state.patient.length);
		if(this.props.patientData.length === 0 && this.state.patient !== '')
		{
			this.handler.handlerAddPatient(this.state.patient, 0);
		}
		else if(this.props.patientData.length > 0 && this.state.patient !== '')
		{
			let lastestID = this.props.patientData[this.props.patientData.length - 1].id;
			this.handler.handlerAddPatient(this.state.patient, lastestID);
		}
		
		this.setState(
		{
			patient:'',
		})
	}

	handleInputChange(event) {
		const target = event.target;
    this.setState(setInputState(this.state, target));
	}

	getPatientValidationState(patientLength) {
		if(patientLength >= 1) {
			this.setState(validateState(this.state, 'success'));
		}
		else if(patientLength === 0) {
			this.setState(validateState(this.state, 'error'));
		}
	}

	render() {
		let patientClose = () => this.setState({ patientShow: false });
		return(
			<section>
			<label className="tool-btn-style" onClick={this.handleModalClick}>
					Add Patient
			</label>
			<Modal
			show={this.state.patientShow} onHide={patientClose}
			aria-labelledby="contained-modal-title"
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title" className="modal-header-style">Add new patient</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="form-horizontal" onKeyPress={this.handleKeyPress}>
						<FormGroup
						controlId="formPatient"
						validationState={this.state.validationState}
						>
							<ControlLabel className="col-md-12 modal-label-style">Patient </ControlLabel>
							<div className="col-md-12">
							<FormControl
								type="text"
								name="patient"
								value={this.state.patient}
								placeholder="Enter patient"
								onChange={this.handleInputChange}
							/>
							</div>
							<FormControl.Feedback/>
						</FormGroup>
						<div className="form-group"> 
							<div className="col-md-12">
								<button type="button" className="btn btn-primary modal-input-btn-style" onClick={this.handleSubmit}>
									<i className="fa fa-plus" aria-hidden="true"/> Add 
								</button>
							</div>
						</div>
					</form>
				</Modal.Body>
			</Modal>
			</section>
		);
	}
}

export default connect()(AddNewPatient);
