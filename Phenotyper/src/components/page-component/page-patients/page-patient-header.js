import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removePatient } from '../../../actions/patient-action.js';
import styled from 'styled-components';
import { Button, Glyphicon } from 'react-bootstrap';

const BlockButton = styled(Button)`
  font-size: 14px;
  right: 5px;
  position: absolute;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: none !important;
  }
`;

let createHandler = function(dispatch) {
  let handlerRemovePatient = function(name) {
    dispatch(removePatient(name));
  };

  return {
    handlerRemovePatient  
  };
}
/***
*** simple component to handle patient remove function
*** it's the header of patient component
*** only has removePatient action
**/
class PatientHeader extends Component {
  constructor(props) {
    super(props);
    this.handler = createHandler(this.props.dispatch);
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleRemove() {
    this.handler.handlerRemovePatient(this.props.patient.name);
  }
  render() {
    return(
      <div className="col-md-10 col-md-offset-1 patient-header">
        <span className="patient-name">{this.props.patient.name}</span>
        <BlockButton 
          bsSize="xsmall"
          bsStyle="link"
          name="delete"
          style={{ color: '#d66' }}
          onClick={this.handleRemove}>
          <Glyphicon glyph="trash"/> 
        </BlockButton>
      </div>
    )
  }
}
export default connect()(PatientHeader);