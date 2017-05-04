import React, { Component } from 'react';
import ParagraphList from '../../components/page-component/page-paragraphs/page-paragraph-list';
// import Paragraph from '../../components/page-component/page-paragraphs/page-paragraph';
import HpoBox from '../../components/page-component/page-hpo/page-hpo-box';
import HpoTool from '../../components/page-component/page-tools/page-tools';
import Patients from '../../components/page-component/page-patients/page-patients';

import { DragDropContext } from 'react-dnd';
//desktop version
import HTML5Backend from 'react-dnd-html5-backend';
import { setPageState, setHpoDragState } from './reducers.js';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/
const PATIENTLIST = 
{
	DESKTOP: 'col-md-9 col-sm-12 col-xs-12 patient-box-container',
	TABLET: 'col-md-12 col-sm-12 col-xs-12 patient-box-container'
};

class PageContainer extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth,
			paragraphData: [],
			hpoData: [],
			droppedUriContainer:[],
			patientData: this.props.patients,
			patientStyle:'grid',
			paragraphID: null,
			uri: null,
			hpoLabel: null,
			hpoCheck: 0,
			searchValue:'',
			searchHPOValue:''
		};
		this.handleResize = this.handleResize.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleAddPatientHPO = this.handleAddPatientHPO.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleHPOSearch = this.handleHPOSearch.bind(this);
		this.displayPatient = this.displayPatient.bind(this);
	}
	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	//add new HPO if hpoCheck = 0
	addNewHPO(patient, dropHpo) {
		let current = this.state.hpoCheck;
		current++;
		this.setState(setPageState(this.state, 'hpoCheck', current));
		patient.hpo.push(dropHpo);
	}

	/*
	* check buggy for when user drop hpo to patient
	* if patient already has that hpo then remove it from the patient
	* check + 1 or check = 0 if no buggy found
	*/
	validateDuplicateHPO(patient, hpoObj, id) {
		for(var i = 0; i < hpoObj.length; i++)
		{
			if(hpoObj[i].id === id)
			{
				let current = this.state.hpoCheck;
				current++;
				this.setState(setPageState(this.state, 'hpoCheck', current));
				patient.hpo.splice(i, 1);
				return this.state.hpoCheck;
			}
			else{
				this.setState(setPageState(this.state, 'hpoCheck', 0));
			}
		}
	}

	/*
	* push hpo value to dropped patient
	*/
	handleAddPatientHPO(paragraphID, uri, hpoLabel, droppedPatientID) {
		const dropHpo = { id:paragraphID, uri:uri, label:hpoLabel};
		const patient = this.state.patientData.map((patients) => {
			if(patients.id === droppedPatientID)
			{
				if(patients.hpo.length < 1)
				{
					patients.hpo.push(dropHpo);
				}
				else
				{
					this.validateDuplicateHPO(patients, patients.hpo, paragraphID);
					if(this.state.hpoCheck === 0)
					{
						this.addNewHPO(patients,dropHpo);
					}
				}
			}
			return patients;
		});

		this.setState(setPageState(this.state, 'patientData', patient));
	}
	
	/*
	* get value from filter text 
	* check if it match with text from paragraph
	*/
	handleSearch(event) {
		this.setState(setPageState(this.state, 'searchValue', event.target.value));
	}

	handleHPOSearch(event) {
		this.setState(setPageState(this.state, 'searchHPOValue', event.target.value));
	}

	//set drag hpo value 
	handleDrag(paragraphID, uri, hpoLabel) {
		this.setState(setHpoDragState(this.state, paragraphID, uri, hpoLabel));
	}

	/*
	* just make sure body content will fit any height
	*/
	handleResize() {
		this.setState({
			windowHeight: window.innerHeight + 200,
			windowWidth: window.innerWidth
		});
	}

	getCurrentWindow() {
		if(this.state.windowWidth !== 1024) {
			return PATIENTLIST.DESKTOP;
		}
		else if(this.state.windowWidth === 1024) {
			return  PATIENTLIST.TABLET;
		}
	}

	displayPatient(style) {
		this.setState(setPageState(this.state, 'patientStyle', style));
	}

	render() {   
		let state = this.state;
		state.patientData = this.props.patients;
		state.hpoData = this.props.hpo;
		state.paragraphData = this.props.paragraphs;

		let patientList = this.getCurrentWindow();
		let windowStyle = { height: this.state.windowHeight };

		//Paragraph search here
		let searchString = this.state.searchValue.trim().toLowerCase();
		if(searchString.length > 0) {
			state.paragraphData = this.state.paragraphData.filter((paragraph)=>{
        return  paragraph.annotation.term.uri.toLowerCase().match(searchString) 
        || paragraph.text.toLowerCase().match(searchString);
      });
		}

		//Search Hpo here
		var searchHpoString = this.state.searchHPOValue.trim().toLowerCase();
		if(searchHpoString.length > 0) {
			state.hpoData = this.state.hpoData.filter((hpo) => {
				return hpo.annotation.term.preferredLabel.toLowerCase().match(searchHpoString) ||
				hpo.annotation.term.uri.toLowerCase().match(searchHpoString);
			})
		}

		return (
			<div style={windowStyle} className="page-container animated slideInUp">
				<div className="page-content-container container">
						<ul className="row nav nav-tabs">
							<li className="col-md-6 col-sm-6 active page-navbar">
								<a className="page-first-navbar"  href="#1" data-toggle="tab">File</a>
							</li>
							<li className="col-md-6 col-sm-6 page-navbar">
								<a className="page-second-navbar" href="#2" data-toggle="tab">PhenoPacket</a>
							</li>
						</ul>
					<div className="tab-content-container">  
						<div className="tab-content ">
							<div className="tab-pane active" id="1">
							<div className="search-container">
							<input className="search-field disable-select search-field-style" type="text" id="input-1"
								value={this.state.searchValue} onChange={this.handleSearch}  />
							<label className="search-label search-label-style" htmlFor="input-1">
								<span className="search-label-content">Text Filter</span>
							</label>
							<svg className="search-graphic search-graphic-style" width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
								<path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"/>
							</svg>
							</div>
								<div style={windowStyle} className="document-container">
									<ParagraphList paragraphs={this.state.paragraphData}/>
								</div>
							</div>
							<div className="tab-pane " id="2">
							<div className="search-container search-hpo-container hidden-sm hidden-xs">
							<input className="search-field disable-select search-field-style" type="text" id="input-2"
							 value={this.state.searchHPOValue} onChange={this.handleHPOSearch}  />
							<label className="search-label search-label-style" htmlFor="input-1">
								<span className="search-label-content">HPO filter</span>
							</label>
							<svg className="search-graphic search-graphic-style" width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
								<path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"/>
							</svg>
							</div>
								<div className="pheno-body-container">
									<HpoTool 
										patientData={this.state.patientData}
										hpoData={this.state.hpoData}
										displayPatient={this.displayPatient}
									/>
									<div style={windowStyle}  className="col-md-3 hidden-sm hidden-xs annotator-box-container">
										<HpoBox hpoData={this.state.hpoData}
											uri={this.state.uri}
											paragraphID={this.state.paragraphID}
											onDrag={(paragraphID, uri, hpoLabel) => this.handleDrag(paragraphID, uri, hpoLabel)}
										/>               
									</div>
									<div style={windowStyle}  className={patientList}>
										<Patients patients={this.state.patientData}
											patientStyle={this.state.patientStyle}
											hpoData={this.state.hpoData}
											uri={this.state.uri}
											paragraphID={this.state.paragraphID}
											hpoLabel={this.state.hpoLabel}
											droppedUriContainer={this.state.droppedUriContainer} 
											handleAddPatientHPO={(paragraphID, uri, hpoLabel, droppedPatientID) => this.handleAddPatientHPO(paragraphID, uri, hpoLabel, droppedPatientID)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default DragDropContext(HTML5Backend)(PageContainer);




