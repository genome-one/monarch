import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import styled from 'styled-components'

const Base = styled.table`
  font-size: 11px;
  border-collapse: separate !important;

  thead td {
    font-weight: bold;
    border-bottom: 3px solid #000 !important;
  }

  td {
    padding: 2px 12px 2px 12px;
    height: 11px;
    min-width: 70px;
  }

  tbody td {
    border: 1px solid #fff;
  }

  tbody > tr > td:first-child {
    border-left: none;
  }

  tbody > tr > td:nth-child(4) {
    border-right: none;
  }
`;

const TrSelectable = styled.tr`
  cursor: pointer;
  
  td {
    border-top: 1px solid ${(props) => props.rowSelect ? '#f00' : '#fff' } !important;
    border-bottom: 1px solid ${(props) => props.rowSelect ? '#f00' : '#fff' }!important;
  }

  td:first-child {
    border-left: 1px solid ${(props) => props.rowSelect ? '#f00' : '#fff' } !important;
  }

  td:last-child {
    border-right: 1px solid ${(props) => props.rowSelect ? '#f00' : '#fff' } !important;
  }
  
  td div {
    border-left: 5px solid ${(props) => props.rowSelect ? '#e00' : 'transparent' };
  }
`;

const TdSortable = styled.td`
  cursor: pointer;
`;

const TdOverallNorm = styled.td`
  background: #ccc;
`;

const TdOverallDisorder = styled.td`
  background: #999;
  color: #fff;
`;

const TdDisorderA = styled.td`
  color: #fff;
  text-align: right;
  background: rgba(
    ${(props) => 225 - (props.value * 20)}, 
    ${(props) => 225 - (props.value * 15)},  
    ${(props) => 240 - (props.value * 10)},  
    1);
`;

const TdMatch = styled.td`
  text-align: center;
`;

const TdDisorderB = styled.td`
  color: #fff;
  background: rgba(
    ${(props) => 240 - (props.value * 5)}, 
    ${(props) => 225 - (props.value * 15)},  
    ${(props) => 225 - (props.value * 25)},  
    1);
`;


const Selector = styled.div`
  display: inline-block;
  width: 0; 
  height: 0; 
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid transparent;
  position: absolute;
  margin-top: 2px;
  margin-left: -8px;
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
export default class TableDiseaseMatch extends Component {
  constructor(props) {
    super(props);
    this.sort = this.sort.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      list: props.data.list,
      rowSelect: 'overall'
    }
  }
  
  componentWillReceiveProps() {
    this.setState({
      list: this.props.data.list
    })
  }
  
  sort(event) { 
    var col = event.currentTarget.dataset.col;
    var newList = this.state.list;
    
    newList.toggledSort = function() {
      var self = this;
      this.asc = !this.asc;
      return this.sort(function (l, r) {
        return l[col] > r[col] ? (self.asc ? 1 : -1) : l[col] < r[col] ? (self.asc ? -1 : 1) : 0;
      });
    };
    
    newList.toggledSort();
    
    this.setState({ list: newList });
    if(this.props.sortCallBack) this.props.sortCallBack(newList);
  }
  
  handleClick(event) {
    var category = event.currentTarget.getAttribute('data-category');
    this.setState({ rowSelect: category  })
    this.props.onRowClick(category)
  }
  
  render() {
    return (
      <Base>
        <thead>
          <tr>
            <TdSortable onClick={this.sort} data-col="label">
              Phenotype Category <Glyphicon glyph="sort" />
            </TdSortable>
            <TdSortable onClick={this.sort} data-col="diseaseA">
              <SmallBox color="blue" />
              {(this.props.data.diseaseAName.length < 20) ? this.props.data.diseaseAName : this.props.data.diseaseAName.substring(0, 17) + '...' }
              <Glyphicon glyph="sort" />
            </TdSortable>
            <TdSortable onClick={this.sort} data-col="matchScore">
              Match Score <Glyphicon glyph="sort" />
            </TdSortable>
            <TdSortable onClick={this.sort} data-col="diseaseB">
              <SmallBox color="orange" />
              {(this.props.data.diseaseBName.length < 20) ? this.props.data.diseaseBName : this.props.data.diseaseBName.substring(0, 17) + '...' }
              <Glyphicon glyph="sort" />
            </TdSortable>
          </tr>
        </thead>
        <tbody>
          <TrSelectable 
            data-category="Overall"
            rowSelect={(() => (this.state.rowSelect === "Overall"))()}
            onClick={this.handleClick}
          >
            <TdOverallNorm><Selector /> Overall</TdOverallNorm> 
            <TdOverallDisorder style={{ textAlign: 'right' }}>{this.props.data.overall.diseaseA}</TdOverallDisorder>
            <TdOverallNorm style={{ textAlign: 'center' }}>{this.props.data.overall.matchScore}</TdOverallNorm>
            <TdOverallDisorder>{this.props.data.overall.diseaseB}</TdOverallDisorder>
          </TrSelectable>
          {
            this.state.list.map((item, $index) => {
              return(
                <TrSelectable 
                  key={$index}
                  data-category={item.label}
                  rowSelect={(() => (this.state.rowSelect === item.label))()}
                  onClick={this.handleClick}
                >
                  <td><Selector /> {item.label}</td> 
                  <TdDisorderA value={item.diseaseA}>{item.diseaseA}</TdDisorderA>
                  <TdMatch>{item.matchScore}</TdMatch>
                  <TdDisorderB value={item.diseaseB}>{item.diseaseB}</TdDisorderB>
                </TrSelectable>
              )
            })
          }
        </tbody>
      </Base>
    );
  }
}