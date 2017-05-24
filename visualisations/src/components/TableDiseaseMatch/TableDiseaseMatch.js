import React from 'react';
import styled from 'styled-components'

const Base = styled.table`
  font-size: 11px;

  thead tr {
    font-weight: bold;
    border-bottom: 3px solid #000 !important;
  }

  td {
    padding: 2px 12px 2px 12px;
    height: 11px;
    min-width: 70px;
  }

  tbody td {
    border: 2px solid #fff;
  }

  tbody > tr > td:first-child {
    border-left: none;
  }

  tbody > tr > td:nth-child(4) {
    border-right: none;
  }

  tbody tr:nth-child(odd) {
    background: #eee;
  }
`;

const TdOverallNorm = styled.td`
  background: #ccc;
`;

const TdOverallDisorder = styled.td`
  background: #999;
`;

const TdDisorder = styled.td`
  color: #fff;
  background: rgba(
    ${(props) => 240 - (props.value * 20)}, 
    ${(props) => 240 - (props.value * 15)},  
    ${(props) => 240 - (props.value * 10)},  
    1);
`;

const SmallBox = styled.div`
  width: 9px;
  height: 9px;
  border: 1px solid #000;
  background: ${(props) => props.color};
  display: inline-block;
  margin-right: 6px;
`;

/**
 * Triptych visualisation
 */
export default function TableDisorderMatch({data}) {
  return (
    <Base>
      <thead>
        <tr>
          <td>Phenotype Category</td>
          <td>Match Score</td>
          <td><SmallBox color="blue" />{data.diseaseAName}</td>
          <td><SmallBox color="orange" />{data.diseaseBName}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TdOverallNorm>Overall</TdOverallNorm> 
          <TdOverallNorm>{data.overall.matchScore}</TdOverallNorm>
          <TdOverallDisorder>{data.overall.diseaseA}</TdOverallDisorder>
          <TdOverallDisorder>{data.overall.diseaseB}</TdOverallDisorder>
        </tr>
        {
          data.list.map((item, $index) => {
            return(
              <tr key={$index}>
                <td>{item.label}</td> 
                <td>{item.matchScore}</td>
                <TdDisorder value={item.diseaseA}>{item.diseaseA}</TdDisorder>
                <TdDisorder value={item.diseaseB}>{item.diseaseB}</TdDisorder>
              </tr>
            )
          })
        }
      </tbody>
    </Base>
  );
}