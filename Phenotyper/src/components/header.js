import React from 'react';
import logo from '../assets/images/logo-monarch-navbar.png';
import {Col, Grid, Row } from 'react-bootstrap';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/
const Header = () =>
{
	return (
		<div className="header-container fade-in-right animate-left-right fade-in-container">
      <Grid>
        <Row>
          <Col sm={1}>
            <img src={logo} className="app-logo" alt="logo" />
          </Col>
          <Col sm={11}>
            <h1 className="header-title fade-in-right animate-left-right fade-in-header-title">
              Monarch Human Phenotype Ontology Annotator
            </h1>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <h3 className="header-introduction fade-in-right animate-left-right fade-in-header-title">
              This service enables researchers to automatically extract Human Phenotype Ontology 
              concepts from publications and export the results as PhenoPackets.
            </h3>
          </Col>
        </Row>
        <Row>
          <p className="header-introduction-step-title fade-in-right animate-left-right fade-in-header-title">
            Please follow these four steps:
          </p>
          <Col sm={10} xs={12} className="header-introduction-step-container fade-in-left animate-left-right fade-in-header-title">
            <ol>
              <li className="header-introduction-step">Upload a PDF Document</li>
              <li className="header-introduction-step">Verify the outcome of the extraction process and remove undesired HPO terms</li>
              <li className="header-introduction-step">Add, modify or remove patients / case studies described in the publication</li>
              <li className="header-introduction-step">Export / download the resulting data as a PhenoPacket</li>
            </ol>
          </Col>
        </Row>
      </Grid>
    </div>
	);
}
export default Header;

