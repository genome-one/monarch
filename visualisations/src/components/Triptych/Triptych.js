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
    margin-bottom: 0;
  }

  .progress-bar {
    background-image: none;
    height: 16px;
    font-size: 11px;
    line-height: 1.6;
    margin-top: 2px;
  }

  tr {
    height: 40px;
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
  vertical-align: middle;
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
          <Left style={{ paddingBottom: 8 }}>
            <b>Searched Profile: <br />
              {Object.keys(data[0])[0]}</b>
          </Left>

          <Middle style={{ paddingBottom: 8 }}>
            <b>SimScore</b>
          </Middle>

          <Right style={{ paddingBottom: 8 }}>
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
              <Left style={{ color: (parseFloat(item[Object.keys(data[0])[0]].informationContent) > 0) ? '#000' : '#999' }}>
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
                    <Pop key={$index} id="triptych-pop-over">
                      <p>
                        <b>Similarity Score:</b> <br />
                        {item.similarity} %
                      </p>
                      <p>
                        <b>Exact match:</b> <br />
                        {`${item.lcs.label} (${item.lcs.informationContent})`}
                      </p>
                    </Pop>) : <Popover key={$index} id="triptych-pop-over" style={{ display: 'none' }} />
                  }
                >
                <div style={{ cursor: 'pointer' }}>
                    <Radial
                      value={item.similarity}
                      thickness="1"
                      scale="6"
                      valueBarColor="#070"
                      style={{ margin: '0px 20px 0px 20px' }}
                    />
                  </div>
                </OverlayTrigger>
              </Middle>
              
              <Right style={{ color: (parseFloat(item[Object.keys(data[0])[1]].informationContent) > 0) ? '#000' : '#999' }}>
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