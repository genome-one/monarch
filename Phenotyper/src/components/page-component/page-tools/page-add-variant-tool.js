import React, { Component } from 'react';
import { Modal, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addPatientMutation } from '../../../actions/patient-action.js';
import { setInputState, validateState } from './reducers';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

let createMutationHandler = function(dispatch) {
  let handlerAddPatientMutation = function(patientID, mutationData, mutationID) {
    dispatch(addPatientMutation(patientID, mutationData, mutationID));
  };
  return {
    handlerAddPatientMutation  
  };
}

export class AddNewVariant extends Component {
	constructor(props) {
		super(props);
		this.state = {
			variant:'',
			variantShow: false,
			validationState: null
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handler = createMutationHandler(this.props.dispatch);
		this.handleModalClick = this.handleModalClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.getVariantLengthValidationState = this.getVariantLengthValidationState.bind(this);
	}
	
	handleModalClick() {
		this.setState({ variantShow: true, validationState: null});
	}

	handleKeyPress(event) {
    if(event.which === 13) {
      event.preventDefault();
    }
  }

	/*
	* check if user enter variant or not
	* then check if user enter the same variant or not
	* if not then add variant 
	*/
	handleSubmit() {
		this.getVariantLengthValidationState(this.state.variant.length);
		let lastestID = 0;
		if(this.props.patient.mutation.length > 0) {
			lastestID = this.props.patient.mutation[this.props.patient.mutation.length - 1].id;
		}

		if(this.state.variant.length > 0) {
			this.handler.handlerAddPatientMutation(this.props.patient, this.state.variant, lastestID); 
		}
		this.setState({
			variant: ''
		})
	}

	handleInputChange(event) {
		const target = event.target;
    this.setState(setInputState(this.state, target));
	}

	getVariantLengthValidationState(variantLength) {
		if(variantLength >= 1) {
			this.setState(validateState(this.state, 'success'));
		}
		else if(variantLength === 0) {
			this.setState(validateState(this.state, 'error'));
		}
	}

	render() {
		let variantClose = () => this.setState({ variantShow: false });
		return(
			<div className="patient-footer-btn">
				<div className="visible-xs visible-sm" onClick={this.handleModalClick}>
					VCF
				</div>
				<div className="visible-md visible-lg" onClick={this.handleModalClick}>
					Add VCF
				</div>

			<Modal
			show={this.state.variantShow} onHide={variantClose}
			aria-labelledby="contained-modal-title"
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title" className="modal-header-style"> VCF/HGVS data for {this.props.patient.name}  </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="form-horizontal" onKeyPress={this.handleKeyPress}>
						<FormGroup
						controlId="formVariant"
						validationState={this.state.validationState}
						>
							<ControlLabel className="col-md-12 modal-label-style"> Mutation Data </ControlLabel>
							<div className="col-md-12">
							<FormControl
								type="text"
								name="variant"
								value={this.state.variant}
								placeholder="Enter mutation data"
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
			</div>
		);
	}
}
export default connect()(AddNewVariant);
