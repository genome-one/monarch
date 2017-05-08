import React from 'react';
import { 
  ProgressBar
} from 'react-bootstrap';
import styled from 'styled-components'
import Radial from './../Radial/Radial'

const Base = styled.table`
  .progress {
    border-radius: 0;
    border: none;
    background: none;
    box-shadow: none;
  }

  .progress-bar {
    background-image: none;
  }
`;

const ProgressBarFlipped = styled(ProgressBar)`
  transform: rotate(180deg) !important;
`;

const Left = styled.td`
  width: 300px;
  text-align: right;
  line-height: 1;
  font-size: 11px;
`;

const Middle = styled.td`
  text-align: center;
  font-size: 11px;
`;

const Right = styled.td`
  width: 300px;
  line-height: 1;
  font-size: 11px;
`;

/**
 * Triptych visualisation
 */
export default function Triptych({data}) {
  return (
    <Base>
      <tr>
        <Left style={{ paddingBottom: 18 }}>
          <b>Searched Profile: <br />
            {Object.keys(data[0])[0]}</b>
        </Left>
        
        <Middle style={{ paddingBottom: 18 }}>
          <b>SimScore</b>
        </Middle>
        
        <Right style={{ paddingBottom: 18 }}>
          <b>Matched Profile: <br />
            {Object.keys(data[0])[1]}</b>
        </Right>  
      </tr>
      {
        data.map((item) => {
          return(
            <tr>
              <Left>
                {item.phenotype1.label} ({item.phenotype1.informationContent})
                <ProgressBarFlipped 
                  now={item.phenotype1.informationContent} 
                  max="15" 
                />
              </Left>
              
              <Middle>
                <Radial
                  value={item.similarity}
                  thickness="2"
                  scale="9"
                  valueBarColor={determineColor(item.similarity)}
                  style={{ margin: '0px 20px 15px 20px' }}
                />
              </Middle>
              
              <Right>
                {item.phenotype2.label} ({item.phenotype2.informationContent})
                <ProgressBar 
                  now={item.phenotype2.informationContent} 
                  max="15" 
                />
              </Right>
            </tr>
          )
        })
      }
    </Base>
  );
}

// The lower the similarity, the greener, vice versa, bluer.
function determineColor(value) {
  return `rgba(0 ,${200 - value}, ${100 + value}, 1)`;
}