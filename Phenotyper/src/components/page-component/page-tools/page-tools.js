import React, { Component } from 'react';
import AddNewHPO from './page-add-hpo-tool';
import AddNewPatient from './page-add-patient-tool';
import DownloadTool from './page-download-tool';
import { setToolState } from './reducers';
/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

/********** 
*** PhenoPacket hpoTool is a tool container for all available tool
*** contain: add new hpo, add new patient and download tool
********/

class HpoTool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showTool: false,
			showList: false
		}
		this.handleShowTool = this.handleShowTool.bind(this);
		this.handleListStyle = this.handleListStyle.bind(this);
	}

	handleShowTool() {
		this.setState(setToolState(this.state, 'showTool'));
	}

	handleListStyle() {
		this.setState(setToolState(this.state, 'showList'));
		if(this.state.showList) {
			this.props.displayPatient('grid');
		}
		else {
			this.props.displayPatient('list');
		}
	}

	getListStyle() {
		if(this.state.showList) {
			return <i className="fa fa-list-ul" aria-hidden="true" onClick={this.handleListStyle}></i>;
		}
		else {
			return <i className="fa fa-th" aria-hidden="true" onClick={this.handleListStyle}></i>;
		}
	}

	render() {
		let hpoTool, patientTool, downloadTool, sendButton;
		if(this.state.showTool) {
			hpoTool = 
				<label className="tool-label-style btn btn-lg btn-primary rotateInUpLeft animated">
					<AddNewHPO hpoData={this.props.hpoData}/> 
				</label>;
			patientTool = 
				<label className="tool-label-style btn btn-lg btn-primary rotateInUpLeft animated">
					<AddNewPatient patientData={this.props.patientData}/>
				</label>;
			downloadTool = 
				<label className="tool-label-style btn btn-lg btn-primary rotateInUpLeft animated">
					<DownloadTool patientData={this.props.patientData}/>
				</label>
			sendButton =					
				<label className="tool-label-style btn btn-lg btn-primary  rotateInUpLeft animated">
					<label className="tool-btn-style">
						Send all to Phenopackets.org
					</label>
				</label>	
		}

		let listStyle = this.getListStyle();

		return(
			<div className="modal-container hpo-modal-container row">
				<div className="btn-group tool-btn-container">
					<label className="tool-label-style btn btn-lg btn-primary">
						<label className="tool-btn-style">
							<i className="fa fa-cog" aria-hidden="true" onClick={this.handleShowTool}></i>
						</label>
					</label>
						{hpoTool}
						{patientTool}
						{downloadTool}
						{sendButton}
					<label className="tool-label-style btn btn-lg btn-primary">
						<label className="tool-btn-style">
							{listStyle}
						</label>
					</label>
				</div>
			</div>
		);    
	}
}

export default HpoTool;

