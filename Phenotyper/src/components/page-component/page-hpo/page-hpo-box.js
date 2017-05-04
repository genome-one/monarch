import React from 'react';
import Hpo from './page-hpo';

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

/********** PhenoPacket hpoBox  ********/

function HpoBox(props)
{
	const hpoNode = props.hpoData.map((hpo, index) => {
		return (<Hpo hpo={hpo} key={index} onDrag={props.onDrag} uri={props.uri} 
			paragraphID={props.paragraphID} hpoLabel={props.hpoLabel}
			showDragIcon/>)
	})
	return(
		<div className="hpo-box-container">
			{hpoNode}
		</div>
	);    
}

export default HpoBox;

