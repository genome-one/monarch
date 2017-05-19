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
  transform: scale(-1, 1) !important;

  .progress-bar {
    transform: scale(-1, 1);
  }
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
      <thead>
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
      </thead>
      <tbody>
      {
        data.map((item, $index) => {
          return(
            <tr key={$index}>
              <Left>
                {item.phenotype1.label}
                <ProgressBarFlipped 
                  now={parseFloat(item.phenotype1.informationContent)} 
                  max={16}
                  label={item.phenotype1.informationContent}
                />
              </Left>
              
              <Middle>
                <Radial
                  value={item.similarity}
                  thickness="2"
                  scale="9"
                  valueBarColor="#e80"
                  style={{ margin: '0px 20px 15px 20px' }}
                />
              </Middle>
              
              <Right>
                {item.phenotype2.label}
                <ProgressBar 
                  now={parseFloat(item.phenotype2.informationContent)} 
                  max={16}
                  label={item.phenotype2.informationContent}
                />
              </Right>
            </tr>
          )
        })
      }
      </tbody>
    </Base>
  );
}