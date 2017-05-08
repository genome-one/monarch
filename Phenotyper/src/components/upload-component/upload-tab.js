import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import VisiblePageContainer from '../../containers/page-container.js';

import { connect } from 'react-redux';
import {getPatients} from '../../actions/patient-action.js';
import {getParagraphs} from '../../actions/paragraph-action.js';
import {getHpo} from '../../actions/hpo-action.js';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Grid, Tab, Row, Col, NavItem, Nav } from 'react-bootstrap';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';
import './loading.css';
import { setUploadState, setTextState, cleanState } from './reducers.js';
import api from '../apis';

const style ='annotation-highlight';

const TabContainer = styled(Tab.Container)`
  width: 80%;
  margin: 0 auto;
  padding: 5em 0 5em 0;

  .panel-title {
    cursor: pointer;
    &:hover {
      a {
        text-decoration: none;
      }
    }
  }
  a {
    border-radius: 0px !important;
  }

  .nav-pills {
    li.active {
      a {
        border-bottom: thin solid #337ab7;
        color: #337ab7;
        background: #fff;
        border-top-color: #fff;
        border-left-color: #fff;
        border-right-color: #fff;
      }
    }
    li {
      marginLeft: 0;
      a {
        border-bottom: thin solid #eee;
        color: #333;
        &:hover {
          background: #337ab7;
          color: #fff;
        }
      }
    }
  }
`;

const TabContentContainer = styled(Col)`
  marginBottom: 2em;
`;

const Container = styled.div`
  margin: 0 auto;
  font-weight: 300;
  letter-spacing: 1px;
  line-height: 1.6em;
  color: #202121;
`;

const HighLightContainer = styled(Col)`
  box-shadow: 0 8px 20px rgba(0,0,0,.08);
  padding: 3em;
`;

const TextField = styled.textarea`
  box-shadow: none!important;
  width: 100%;
  height: 100%;
  min-height: 15em;
  padding: 12px 20px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;
  outline: none;
  resize: none;
`;

const UploadButton = styled.button`
  margin: 18px 6px 0px 0px;
  border-style: none;
  background-color: ${props => props.clear ? '#d9534f' : '#26b36c'};
  color: white;
  padding: 11px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  border-radius: 0px;
  -webkit-transition: background-color 0.3s;
  -webkit-transition-timing-function: ease;
  text-transform: uppercase;

  &:hover {
    background-color: ${props => props.clear ? '#d43f3a' : 'rgba(38, 179, 108, 0.74)'};
  }
`;
/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

//redux dispatch handler
let createPatientHandler = function(dispatch) 
{
  let handlerGetPatient = function(data) 
  {
    dispatch(getPatients(data));
  };

  let handlerGetParagraph = function(data)
  {
    dispatch(getParagraphs(data));
  }

  let handlerGetHpo= function(data)
  {
    dispatch(getHpo(data));
  }

  return {
    handlerGetPatient,
    handlerGetParagraph,
    handlerGetHpo  
  };
}
/***
*** upload component to handle upload new pdf file as well as sending data to redux reducers
*** handle redux functions for getting data of patient, paragraph and hpo
*** handler when file uploaded: handlerGetPatient, handlerGetParagraph, handlerGetHpo  
**/
export class UploadTabComponent extends Component {
  constructor(props) 
  {
    super(props);
    this.state ={
      fileStatus:'',
      loaderStatus: false,
      uploadText:'',
      uploadContent:''
    }   
    /*
    * file type: only pdf
    * max file: 1
    */
    this.djsConfig = {
      acceptedFiles: ".pdf",
      addRemoveLinks: true,
      autoProcessQueue: true,
      maxFiles: 1,
      params: {
      }
    };
    
    /*
    * server post url config
    */
    this.componentConfig = {
      iconFiletypes: ['.pdf'],
      showFiletypeIcon: true,
      postUrl: 'http://43.240.98.24:5555/cr/upload'
    };


    // simple callback when we process the pdf file
    this.callback = file => this.setLoader(file);
    this.addedfile = file =>  console.log('added');
    this.success = file => this.getFileContent('uploaded',file);
    this.removedfile = file =>  this.getFileContent('removed',file);
    this.error = file => this.getFileContent('error', file);
    this.dropzone = null;
    this.handler = createPatientHandler(this.props.dispatch);
    this.init = this.init.bind(this);
    this.cleanFile = this.cleanFile.bind(this);
    this.setLoader = this.setLoader.bind(this);
    this.getFileContent = this.getFileContent.bind(this);
    this.getSpinner = this.getSpinner.bind(this);
    this.getUploadText = this.getUploadText.bind(this);
    this.getAnnotationKeyword = this.getAnnotationKeyword.bind(this);
    this.getTextField = this.getTextField.bind(this);
    this.handleUploadText = this.handleUploadText.bind(this);
  }
  /* 
  * set status when file is processing
  */
  setLoader(file) {
    this.setState(setUploadState(this.state, '', true));
  }
  
  init(content) {
    let initPatient = {  
      "id":0,
      "name":"patient:1",
      "status":{"id": "NEW", "preferredLabel": "New"},
      "hpo":[],
      "mutation":[],
      "date":""
    }
    this.handler.handlerGetPatient([Object.assign({},initPatient)]);
    this.handler.handlerGetParagraph(content);
    this.handler.handlerGetHpo(content);
  }
  /*
  * if file is uploaded then get the json content from server response
  * else clear the component
  */
  getFileContent(status, file) {
    if(status === 'uploaded') {
      this.init(JSON.parse(file.xhr.response));
      this.setState(setUploadState(this.state, status, false));
      NotificationManager.success('Success', 'Uploaded', 2000);
    }
    else if(status === 'removed' || status === 'error') {
      this.cleanFile();
    }
  }

  getSpinner() {
    if(this.state.loaderStatus === true) {
      return <span className="loading"/>;
    }
    else {
      return '';
    }
  }

  getUploadText(event) {
    this.setState(setTextState(this.state, 'uploadText', event.target.value));
  }

  getAnnotationKeyword(annotation) {
    let keyword = [];
    annotation.map((a) => {
      return keyword.push(a.text);
    })
    return keyword;
  }

  getTextField() {
    if(this.state.fileStatus === 'uploaded' && this.state.uploadText !== '') {
      let annotationKeyword = this.getAnnotationKeyword(this.state.uploadContent);
      return (
        <Container className="row">
          <HighLightContainer md={12}>
          <Highlighter 
            highlightClassName={style}
            searchWords={annotationKeyword}
            textToHighlight={this.state.uploadText}/>
          </HighLightContainer>
          <Col md={4}>
          <UploadButton style={{ margin: '12px 0' }} onClick={this.cleanFile} clear>
            Clear
          </UploadButton>
          </Col>
        </Container>
      )
    }
    else {
      return <Container>
        <TextField type="textarea" placeholder="Write something..." 
        onChange={this.getUploadText} value={this.state.uploadText}/>
        <UploadButton style={{ margin: '12px 0' }} onClick={this.handleUploadText}>
          Upload
        </UploadButton>
      </Container>
    }
  }

  storeUploadedText(json) {
    let convertData = [];
    for(var i = 0; i < json.length; i++) {
      convertData.push({'annotation': json[i], 'id': i, 'text': json[i].original_text});
    }
    return convertData;
  }

  handleUploadText() {
    this.setLoader();
    return api.uploadText(this.state.uploadText).then((response) => {
      if (!response.ok) {
        return false;
      }
      return response.json();
    }).then((json) => 
      {
        if(json.length > 0) {
          this.setState(setTextState(this.state, 'uploadContent', this.storeUploadedText(json)))
          this.init(this.state.uploadContent);
          this.setState(setUploadState(this.state, 'uploaded', false));
          NotificationManager.success('Success', 'Uploaded', 2000);
        }
        else {
          this.setState(setUploadState(this.state, 'error', false));
          NotificationManager.error('Error','Upload failed', 2000); 
        }
      }
    );
  }

  cleanFile() {
    const fileRemoved = [];
    this.dropzone.removeAllFiles();
    this.init(fileRemoved);
    this.setState(cleanState(this.state));
  }

  render() 
  {
    const config = this.componentConfig;
    const djsConfig = this.djsConfig;
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      drop: this.callback,
      addedfile: this.callback,
      success: this.success,
      removedfile: this.removedfile,
      error: this.error
    }

    // handle spinner when file is uploading
    let spinner = this.getSpinner();

    //check if file is uploaded and set the visibility for body contents
    let PageContainerBody ='';

    //get file content when file is uploaded
    if(this.state.fileStatus === 'uploaded')
    {
      PageContainerBody = <VisiblePageContainer/>
    }

    let textField = this.getTextField();

    return( 
      <div>
        <Grid>
          <TabContainer id="upload-tab" defaultActiveKey="first">
            <Row className="clearfix">
              <TabContentContainer sm={12}>
                <Nav bsStyle="pills">
                  <NavItem eventKey="first" className='col-md-6' style={{'borderRight':'thin solid #ccc'}} onClick={this.cleanFile}>
                    Upload a file 
                  </NavItem>
                  <NavItem eventKey="second" className='col-md-6' onClick={this.cleanFile}>
                    Add text
                  </NavItem>
                </Nav>
              </TabContentContainer>
              <Col sm={12}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="first">
                    <Container>
                      {spinner}
                      <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig}/>
                    </Container>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    {spinner}
                    {textField}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </TabContainer>
        </Grid>
      {PageContainerBody}
      <NotificationContainer/>
      </div>
    );
  }
}

export default connect()(UploadTabComponent);
