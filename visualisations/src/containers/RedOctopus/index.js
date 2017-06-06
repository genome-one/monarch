import React, { Component } from 'react';
import { 
  ButtonToolbar,
  DropdownButton,
  MenuItem,
  Glyphicon
} from 'react-bootstrap';
import styled from 'styled-components';
import { getComparedAttributeSets } from './apis';
import { 
  getPhenotypeClassifications, 
  initClassedPhenotype, 
  populateClassedPhenotype 
} from './data.phenoClass';
import { clustering, generateAxisData, groupSimilar } from './data.clustering';
import { 
  initRadarAxisData,
  countForRadar,
  sortRadarAxisByTableData
} from './data.radar';
import { initTableData, populateTableData } from './data.table';
import { 
  initTriptychData,
  generateTriptychQueryString,
  processDataForTriptych
} from './data.triptych';
import dataAchondroplasia from './testData.achondroplasia';
import dataPseudoAchondroplasia from './testData.pseudoachondroplasia';
import dataAlkaptonuria from './testData.alkaptonuria';
import dataPhenylketonuria from './testData.phenylketonuria';
import dataTetraploidy from './testData.tetraploidy';
import dataTriploidy from './testData.triploidy';
import Radar from './../../components/Radar/Radar';
import Triptych from './../../components/Triptych/Triptych';
import TableDiseaseMatch from './../../components/TableDiseaseMatch/TableDiseaseMatch';

const Header = styled.div`
  background: #000;
  height: 52px;
  padding: 8px 24px 8px 24px;
  color: #eee;
  
  b {
    font-size: 16px;
  }

  & > * {
    display:inline-block;
    margin-right: 24px;
    vertical-align: middle;
  }
`;

const Left = styled.div`
  float: left;
  padding: 24px 0 0 24px;
`;

const Right = styled.div`
  float: left;
  padding: 24px 64px 24px 32px;
`;

const SpinningLogo = styled(Glyphicon)`
  margin-right: 6px;
  -webkit-animation: spin 1000ms infinite linear;
  animation: spin 1000ms infinite linear;
`;

export default class RedOctopus extends Component {
  constructor(props) {
    super(props);
    this.updateVisualisation = this.updateVisualisation.bind(this);
    this.updateTriptych = this.updateTriptych.bind(this);
    this.sortTableCallBack = this.sortTableCallBack.bind(this);
    this.handleTableRowClick = this.handleTableRowClick.bind(this);
    this.state = {
      diseaseA: {},
      diseaseB: {},
      classedPhenotypeA: {},
      classedPhenotypeB: {},
      table: [],
      radar: [],
      triptych: [],
      clusteringRadar: []
    }
  }
  
  componentWillMount() {
    this.updateVisualisation(dataAchondroplasia(), dataPseudoAchondroplasia());
  }
  
  updateVisualisation(dataA, dataB) {
    var classifications = getPhenotypeClassifications([dataA, dataB]);
    var classPhenoUnpopulated = initClassedPhenotype(classifications);
    var classPhenotypeA = populateClassedPhenotype(classPhenoUnpopulated, dataA);
    var classPhenotypeB = populateClassedPhenotype(classPhenoUnpopulated, dataB);
    var radarAxis = initRadarAxisData(classifications);
    var tableData = initTableData(classifications);
    populateTableData(tableData, 'diseaseA', dataA);
    populateTableData(tableData, 'diseaseB', dataB);
    this.handleClustering(dataA, dataB);
    this.updateTriptych(classPhenotypeA, classPhenotypeB, dataA.name, dataB.name);
    this.setState({
      classedPhenotypeA: classPhenotypeA,
      classedPhenotypeB: classPhenotypeB,
      radar: [
        countForRadar(radarAxis, dataA),
        countForRadar(radarAxis, dataB)
      ],
      table: tableData,
      tableSelect: 'Overall',
      triptych: []
    })
  }
  
  updateTriptych(classPhenotypeA, classPhenotypeB, profileNameA, profileNameB) {
    this.setState({ triptych: [] });
    
    var preData = initTriptychData(classPhenotypeA, classPhenotypeB);
    var triptychQString = generateTriptychQueryString(preData.selectedA, preData.selectedB);
    getComparedAttributeSets(triptychQString)
      .then((data) => {
        var allPhenotypeA = [], allPhenotypeB = [];
      
        Object.keys(classPhenotypeA).forEach(function(key,index) {
          allPhenotypeA.push.apply(allPhenotypeA, classPhenotypeA[key]);
        });
      
        Object.keys(classPhenotypeB).forEach(function(key,index) {
          allPhenotypeB.push.apply(allPhenotypeB, classPhenotypeB[key]);
        });
      
        this.setState({
          triptych: processDataForTriptych(data, profileNameA, profileNameB, allPhenotypeA, allPhenotypeB)
        });
      });
  }
  
  handleClustering(dataA, dataB) {
    this.setState({ clusteringRadar: [] });
    
    clustering(dataA, dataB).then((cData) => {
      this.setState({
        clusteringRadar: groupSimilar(generateAxisData(cData, dataA, dataB))
      });
    });
  }
  
  sortTableCallBack(newTableData) {
    this.setState({
      radar: sortRadarAxisByTableData(this.state.radar, newTableData)
    })
  }
  
  handleTableRowClick(data) {
    var profileNameA = this.state.table.diseaseAName,
        profileNameB = this.state.table.diseaseBName,
        leftData = [], rightData = [];
    
    this.setState({ tableSelect: data });
    
    if(data === 'Overall') {
      leftData = this.state.classedPhenotypeA;
      rightData = this.state.classedPhenotypeB;
    } else {
      leftData = { [data]: this.state.classedPhenotypeA[data] };
      rightData = { [data]: this.state.classedPhenotypeB[data] };
    }
    
    this.updateTriptych(leftData, rightData, profileNameA, profileNameB);
  }
  
  render() {
    return (
      <div>
        <Header>
          <b>Monarch Disease Comparison</b>
          
          <ButtonToolbar>
            <DropdownButton bsSize="small" title="Choose Dataset" id="diseasePairSelect">
              <MenuItem eventKey="1" 
                onClick={() => {this.updateVisualisation(dataAchondroplasia(), dataPseudoAchondroplasia())}}>
                Achondroplasia / Pseudoachondroplasia
              </MenuItem>
              <MenuItem eventKey="2"
                onClick={() => {this.updateVisualisation(dataAlkaptonuria(), dataPhenylketonuria())}}>
                Alkaptonuria / Phenylketonuria
              </MenuItem>
              <MenuItem eventKey="3"
                onClick={() => {this.updateVisualisation(dataTetraploidy(), dataTriploidy())}}>
                Tetraploidy / Triploidy
              </MenuItem>
            </DropdownButton>
          </ButtonToolbar>
        </Header>
        
        <Left>
          <h4>{this.state.table.diseaseAName} / {this.state.table.diseaseBName}</h4>
          {this.state.radar.length > 0 &&
            <Radar 
              data={this.state.radar} 
              options={{
                w: 360,
                h: 360,
                wrapWidth: 100,
                labelFactor: 1.25,
                dotRadius: 2.5,
                strokeWidth: 1
              }}
            />
          }
                    
          <TableDiseaseMatch 
            data={this.state.table}
            sortCallBack={this.sortTableCallBack}
            onRowClick={this.handleTableRowClick}
          />
        </Left>
        
        <Right>
          <h4>{ this.state.tableSelect }</h4>
          {this.state.clusteringRadar.length > 0 ?
            <Radar 
              data={this.state.clusteringRadar} 
              options={{
                w: 360,
                h: 360,
                wrapWidth: 100,
                labelFactor: 1.25,
                dotRadius: 2.5,
                strokeWidth: 1
              }}
            /> :
            <div>
              <SpinningLogo glyph="refresh" /> Clustering...
            </div>
          }

          {this.state.triptych.length > 0 ?
            <Triptych data={this.state.triptych}/> :
            <div>
              <SpinningLogo glyph="refresh" /> Loading Triptych Data...
            </div>
          }
        </Right> 
      </div>
    );
  }
}

