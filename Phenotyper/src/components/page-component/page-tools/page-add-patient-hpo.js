import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import { setPageState } from '../reducers';
/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

/*
* This component used for tablet/mobile version only
*/
export default class AddNewPatientHPO extends Component {
	constructor() {
		super();
		this.state = {
			hpoShow: false,
			validationState: null,
			hpoValue:''
		}
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleModalClick = this.handleModalClick.bind(this);
	}

  handleModalClick() {
		this.setState(setPageState(this.state, 'hpoShow', true));
	}

	handleSelectChange(value) {
		this.setState(setPageState(this.state,'hpoValue', value));
	}

	handleAddHpo(hpoSubmit, i) {
		this.props.hpoData.filter((hpo) =>
		{
			if(hpoSubmit[i] === hpo.annotation.term.uri)
			{
				return this.props.handleAddPatientHPO(hpo.id, hpo.annotation.term.uri, hpo.annotation.term.preferredLabel, this.props.patient.id);
			}
			else {
				return '';
			}
		})
	}

	handleSubmit() {
		var hpoSubmit = this.state.hpoValue.split(",");
		for(var i = 0; i < hpoSubmit.length; i++)
		{
			this.handleAddHpo(hpoSubmit, i);
		}
		this.setState(setPageState(this.state,'hpoValue',''));
	}

	render() {
		let hpoClose = () => this.setState(setPageState(this.state, 'hpoShow', false));
		return(
			<section>
			<label className="variant-btn-style" onClick={this.handleModalClick}>
				HPO
			</label>
			<Modal
			show={this.state.hpoShow} onHide={hpoClose}
			aria-labelledby="contained-modal-title"
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title" className="modal-header-style"> HPO data for {this.props.patient.name}  </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="form-horizontal">
						<Select multi simpleValue
						autosize={true} 
						value={this.state.hpoValue} 
						placeholder="Select hpo(s)" 
						options={this.props.hpoData.map((hpo) =>
						{
							return (
							{
								value: hpo.annotation.term.uri, 
								label: hpo.annotation.term.preferredLabel
							}
						);
						})} 
						onChange={this.handleSelectChange} />
						<div className="form-group"> 
							<div className="col-md-12">
								<button type="button" className="btn btn-primary modal-input-btn-style add-hpo-btn" onClick={this.handleSubmit}>
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