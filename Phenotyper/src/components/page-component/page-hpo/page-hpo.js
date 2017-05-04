import React, {PropTypes } from 'react';
import Types from '../Types';
import { DragSource } from 'react-dnd';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

/********** PhenoPacket Hpo ********/

/***
*** drag function:
*** simple return the value of dragged hpo so we know which hpo is selected by user
**/
const HpoSource = {
  //must return plain object
  //send back the hpo details waiting for dropping action
  beginDrag(props, monitor) {
    props.onDrag(props.hpo.id, props.hpo.annotation.term.uri, props.hpo.annotation.term.preferredLabel);
    return { };
  }
};

function collect(connect, monitor) {
  return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
  };
}
/***
*** this will be DragSource component type HPO 
*** style will be changed base on whether user drag the hpo or not
***/
function Hpo (props) 
{
  const {isDragging, connectDragSource, showDragIcon} = props;
  const opacity = isDragging ? 0 : 1;
  const dropEffect = showDragIcon ? 'copy' : 'move';
  return connectDragSource(
    <div className="row hpo-container" style={{opacity}}>
      <div className="pheno-hpo-annotation col-md-12 col-sm-12">
        {props.hpo.annotation.term.preferredLabel}
      </div>
      <div className="pheno-hpo-annotation col-md-12 col-sm-12">
        ({props.hpo.annotation.term.uri})
      </div>
      <div className="pheno-hpo-annotation col-md-12 col-sm-12">
        <div className="observe-btn observe-btn-style">
          <input id={props.hpo.annotation.term.uri} type="checkbox"/>
          <label htmlFor={props.hpo.annotation.term.uri}></label>
          <div className="observe-btn-icon"></div>
        </div>
      </div>
    </div>,
    {dropEffect}
  );
}

Hpo.propTypes = 
{
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    showDragIcon: PropTypes.bool
};
export default DragSource(Types.HPO, HpoSource, collect)(Hpo);

