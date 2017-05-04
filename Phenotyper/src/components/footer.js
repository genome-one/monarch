import React from 'react';
import ojrdLogo from '../assets/images/OJRD.jpg';
import garvanLogo from '../assets/images/logo-garvan.jpg';
import monarchLogo from '../assets/images/logo-monarch.png';
import {Col, Grid, Row } from 'react-bootstrap';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/
const Footer = () =>
{
  return (
    <div className="footer-container">
      <Grid>
        <Row className="footer-about-container">
          <Col sm={6} smOffset={3}>
            <p className="footer-about-content">
              The service is developed by the 
              <a target="_blank" className="footer-href" href="https://monarchinitiative.org/"> Monarch Initiative</a>.
            </p>
          </Col>
        </Row>
        <Row>
          <div className="text-muted footer-poweredby">
            Powered By <a target="_blank" href="http://human-phenotype-ontology.org" className="footer-href">Human Phenotype Ontology </a> 
            and Bio-LarK CR (see  
            <a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/25725061"  className="footer-href"> PMID:25725061 </a> 
              and 
            <a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/26119816"  className="footer-href"> PMID:26119816</a>)
          </div>
          <ul className="logo-list">
            <li className="logo-list-ojrd logo-list-item-garvan">
              <img src={ojrdLogo} alt="garvan" width='42px' />
            </li>
            <li className="logo-list-item logo-list-item-garvan">
              <img src={garvanLogo} alt="garvan" />
            </li>
            <li className="logo-list-item logo-list-item-monarch">
              <img src={monarchLogo} alt="monarch"/>
            </li>
          </ul>
        </Row>
      </Grid>
    </div>
  );
}
export default Footer;

