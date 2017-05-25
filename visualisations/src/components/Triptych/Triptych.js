import React from 'react';
import { 
  ProgressBar,
  OverlayTrigger,
  Popover
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
  width: 240px;
  text-align: right;
  line-height: 1;
  font-size: 11px;
`;

const Middle = styled.td`
  text-align: center;
  font-size: 11px;
`;

const Right = styled.td`
  width: 240px;
  line-height: 1;
  font-size: 11px;
  .progress-bar {
    background: #e80;
  }
`;

const Pop = styled(Popover)`
  font-size: 11px !important;
  .popover-title {
    font-size: 11px !important;
  }
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
                {item[Object.keys(data[0])[0]].label}
                <ProgressBarFlipped 
                  now={parseFloat(item[Object.keys(data[0])[0]].informationContent)} 
                  max={16}
                  label={item[Object.keys(data[0])[0]].informationContent}
                />
              </Left>
              
              <Middle>
                <OverlayTrigger 
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={
                    item.lcs ? (
                    <Pop key={$index} title="Least Common Subsuming" id="triptych-pop-over">
                      {`${item.lcs.label} (${item.lcs.informationContent})`}
                    </Pop>) : <Popover key={$index} id="triptych-pop-over" style={{ display: 'none' }} />
                  }
                >
                <div style={{ cursor: 'pointer' }}>
                    <Radial
                      value={item.similarity}
                      thickness="1"
                      scale="9"
                      valueBarColor="#070"
                      style={{ margin: '0px 20px 15px 20px' }}
                    />
                  </div>
                </OverlayTrigger>
              </Middle>
              
              <Right>
                {item[Object.keys(data[0])[1]].label}
                <ProgressBar 
                  now={parseFloat(item[Object.keys(data[0])[1]].informationContent)} 
                  max={16}
                  label={item[Object.keys(data[0])[1]].informationContent}
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