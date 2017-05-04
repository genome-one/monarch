import React, { Component } from 'react';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';
import { removeParagraphs } from '../../../actions/paragraph-action.js';
import { setStyleState } from './reducers.js';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

const style ='annotation-highlight';
const PARAGRAPH = {
  ODD: 'row paragraph-container paragraph-odd-style',
  EVEN: 'row paragraph-container paragraph-even-style',
};

const HPO = {
  ODD: 'col-md-4 col-sm-5 hpo-box hpo-odd-style',
  EVEN: 'col-md-4 col-sm-5 hpo-box hpo-even-style',
}
/********** Paragraph list ********/
let createParagraphHandler = function(dispatch) {
  let handlerRemoveParagraph = function(id) {
    dispatch(removeParagraphs(id));
  };

  return {
    handlerRemoveParagraph  
  };
}

class ParagraphList extends Component {
	constructor(props) {
		super(props);
		this.handler = createParagraphHandler(this.props.dispatch);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleRemove(id) {
		this.handler.handlerRemoveParagraph(id);
	}

	render() {
		const paragraphNode = this.props.paragraphs.map((paragraph, index) => {
			return <Paragraph paragraph={paragraph} key={paragraph.id} 
			index={index} remove={this.handleRemove}/>
		});
		return(
			<section>
				{paragraphNode}
			</section>
		);    
	}
}

class Paragraph extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paragraphStyle: '',
			hpoStyle: ''
		}
	}
	componentDidMount() {
		if(this.props.index % 2 !== 0) {
			this.setState(setStyleState(this.state, PARAGRAPH.ODD, HPO.ODD));
		}
		else {
			this.setState(setStyleState(this.state, PARAGRAPH.EVEN, HPO.EVEN));
		}
	}

	render() {
		var annotationKeyword = [];
		this.props.paragraph.text = this.props.paragraph.text.replace(/[‘‘’’]/g,'');
		annotationKeyword.push(this.props.paragraph.annotation.original_text);
		return (
			<div className={this.state.paragraphStyle}>
			<div className="col-md-8 col-sm-7 paragraph-text">
			<Highlighter 
				highlightClassName={style}
				searchWords={annotationKeyword}
				textToHighlight={this.props.paragraph.text}/>
			</div>
			<div className={this.state.hpoStyle} onClick={() => {this.props.remove(this.props.paragraph.id)}}>
				<div className="paragraph-hpo-annotation col-md-12 col-sm-12">
					{this.props.paragraph.annotation.term.preferredLabel}
				</div>
				<div className="paragraph-hpo-annotation col-md-12 col-sm-12">
					({this.props.paragraph.annotation.term.uri})  
				</div>
			</div>
			</div>
		);
	}
}

export default connect()(ParagraphList);

