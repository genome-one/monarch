import React, { Component } from 'react';
import { Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addHpo } from '../../../actions/hpo-action.js';
import { setInputState, validateState } from './reducers';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

//redux dispatch handler
let createHPOHandler = function(dispatch) {
  let handlerAddHPO = function(uri, label, lastestID) {
    dispatch(addHpo(uri, label, lastestID));
  };

  return {
    handlerAddHPO  
  };
}

export class AddNewHPO extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uriValue: '',
  		labelValue:'',
  		hpoShow: false,
  		validationState: null
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.getHPOValidationState = this.getHPOValidationState.bind(this);
		this.handler = createHPOHandler(this.props.dispatch);
		this.handleModalClick = this.handleModalClick.bind(this);
	}
	
	handleModalClick() {
		this.setState({ hpoShow: true, validationState: null});
	}
	/*
	* submit uriValue and label
	* clear the field
	*/
	handleSubmit() {
		this.getHPOValidationState(this.state.uriValue.length, this.state.labelValue.length);
		if(this.state.labelValue.length > 0 && this.state.uriValue.length > 0) {
			let lastestID = this.props.hpoData[this.props.hpoData.length - 1].id;
			this.handler.handlerAddHPO(this.state.uriValue, this.state.labelValue, lastestID);
		}
		this.setState({
			uriValue: '',
  		labelValue:''
		})
	}

	handleInputChange(event) {
		const target = event.target;
    this.setState(setInputState(this.state, target));
	}
	
	/*
	* simple validation to check if user fill in the field
	*/
	getHPOValidationState(uriLength, labelLength) {
		if(uriLength >= 1 && labelLength >= 1) {
			this.setState(validateState(this.state, 'success'));
		}
		else if(uriLength === 0 || labelLength === 0) {
			this.setState(validateState(this.state, 'error'));
		}
	}

	render() {
		let hpoClose = () => this.setState({ hpoShow: false });
		return(
			<section>
			<label className="tool-btn-style" onClick={this.handleModalClick}>
					Add HPO
			</label>
			<Modal
			show={this.state.hpoShow} onHide={hpoClose}  
			aria-labelledby="contained-modal-title"
			>
				<Modal.Header closeButton  className="modal-header-style">
					<Modal.Title id="contained-modal-title">Add new hpo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="form-horizontal modal-form-style">
						<FormGroup
						controlId="formHPOLabel"
						validationState={this.state.validationState}
						>
							<ControlLabel className="col-md-12 modal-label-style"> HPO label </ControlLabel>
							<div className="col-md-12">
							<FormControl
								name="labelValue"
								type="text"
								value={this.state.labelValue}
								placeholder="Enter hpo label"
								onChange={this.handleInputChange}
							/>
							</div>
							<FormControl.Feedback/>
						</FormGroup>
						<FormGroup
						controlId="formHPOUri"
						validationState={this.state.validationState}
						>
							<ControlLabel className="col-md-12 modal-label-style"> HPO uri </ControlLabel>
							<div className="col-md-12">
							<FormControl
								name="uriValue"
								type="text"
								value={this.state.uriValue}
								placeholder="Enter hpo uri"
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
export default connect()(AddNewHPO);
