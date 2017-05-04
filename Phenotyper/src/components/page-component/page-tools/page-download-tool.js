import React, { Component } from 'react';
import api from '../../apis';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

export default class DownloadTool extends Component {
	constructor() {
		super();
		this.state = {
			hpoShow: false,
      responsePatient:[]
		}
    this.handleDownload = this.handleDownload.bind(this);
    this.hanldeSaveFileAs = this.hanldeSaveFileAs.bind(this);
	}
  /*
  * this function used for post a json data to the server
  * then get back the response data for user to download it
  */
  handleDownload() {
    return api.download(this.props.patientData).then(function(response) {
      if (!response.ok) {
        return false;
      }
      return response.json();
    }).then((json) => 
      {
        var file = new Blob([JSON.stringify(json)], {type: 'application/json'});
        var url = URL.createObjectURL(file);
        var filename = 'patient.json';
        this.hanldeSaveFileAs(url, filename);
      }
    );
  }
  /*
  * create a download file
  */
  hanldeSaveFileAs(url, filename) {
    var downloadLink = document.createElement('a');
    if(typeof downloadLink.download === 'string') {
      //add the downloadLink to the body prepare for Firefox
      document.body.appendChild(downloadLink); 
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();
      //remove the downloadLink from body when it done
      document.body.removeChild(downloadLink); 
    } 
    else {
      location.replace(url);
    }
  }

	render() {
		return(
			<section>
        <label className="tool-btn-style" >
          <a className="download-btn" onClick={this.handleDownload}>
            Download
          </a>
        </label>
			</section>
		);
	}
}
