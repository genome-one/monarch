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
  position: fixed;
  width: 50%;
  top: 60px;
  left: 0;
  overflow: auto;
  padding: 24px 0 0 24px;
  padding-bottom: 100px;
  height: 100%;
`;

const Right = styled.div`
  position: fixed;
  width: 50%;
  top: 60px;
  right: 0;
  overflow: auto;
  padding: 24px 16px 24px 16px;
  padding-bottom: 100px;
  height: 100%;
`;

const SpinningLogo = styled(Glyphicon)`
  margin-right: 6px;
  -webkit-animation: spin 1000ms infinite linear;
  animation: spin 1000ms infinite linear;
`;

const TriptychSection = styled.div`
  border-bottom: 1px solid #888;
  display: flex;
  align-items: center;
  padding: 24px 0 24px 0;
`;

const TriptychCategory = styled.div`
  width: 120px;
  font-size: 12px;
  font-weight: bold;
  text-align: right;
  float: left;
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
    var radarData = [
          countForRadar(radarAxis, dataA),
          countForRadar(radarAxis, dataB)
        ];
    var tableData = initTableData(classifications);
    populateTableData(tableData, 'diseaseA', dataA);
    populateTableData(tableData, 'diseaseB', dataB);
    this.updateTriptych(classPhenotypeA, classPhenotypeB, dataA.name, dataB.name, radarData);
    this.setState({
      diseaseA: dataA,
      diseaseB: dataB,
      classedPhenotypeA: classPhenotypeA,
      classedPhenotypeB: classPhenotypeB,
      radar: radarData,
      clusteringRadar: [],
      table: tableData,
      tableSelect: 'Overall',
      triptych: {}
    });
  }

  updateTriptych(classPhenotypeA, classPhenotypeB, profileNameA, profileNameB, radarData) {
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
          triptych: processDataForTriptych(data, profileNameA, profileNameB, allPhenotypeA, allPhenotypeB, radarData)
        });
      });
  }

  handleClustering(dataA, dataB, categoryFilter) {
    this.setState({ clusteringRadar: [] });

    return clustering(dataA, dataB, categoryFilter).then((cData) => {
      var cRadarData = groupSimilar(generateAxisData(cData, dataA, dataB));
      this.setState({
        clusteringRadar: cRadarData
      });
      
      return cRadarData;
    });
  }

  sortTableCallBack(newTableData) {
    this.setState({
      radar: sortRadarAxisByTableData(this.state.radar, newTableData)
    }, () => {
      this.updateTriptych(
        this.state.classedPhenotypeA,
        this.state.classedPhenotypeB,
        this.state.diseaseA.name,
        this.state.diseaseB.name,
        this.state.radar
      );
    })
  }

  handleTableRowClick(data) {
    var profileNameA = this.state.table.diseaseAName,
        profileNameB = this.state.table.diseaseBName,
        leftData = [], rightData = [], classFilter;

    this.setState({
      tableSelect: data,
      triptych: {}
    });

    if(data === 'Overall') {
      leftData = this.state.classedPhenotypeA;
      rightData = this.state.classedPhenotypeB;
      this.updateTriptych(leftData, rightData, profileNameA, profileNameB, this.state.radar);
    } else {
      leftData = { [data]: this.state.classedPhenotypeA[data] };
      rightData = { [data]: this.state.classedPhenotypeB[data] };
      classFilter = data;
      
      var doClustering = new Promise((resolve, reject)=> {
        resolve(this.handleClustering(this.state.diseaseA, this.state.diseaseB, classFilter));
      });
    
      doClustering.then((cRadarData) => {
        this.updateTriptych(leftData, rightData, profileNameA, profileNameB, cRadarData);
      });
    }
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
          <h4>
            <span style={{ backgroundColor: '#1f5bb4', color: 'white', padding: '8px 18px 8px 18px'}}>{this.state.table.diseaseAName}</span> 
            <span style={{ padding: '0px 16px 0px 16px' }}>VS</span> 
            <span style={{ backgroundColor: '#e80', color: 'white',  padding: '8px 18px 8px 18px'}}>{this.state.table.diseaseBName}</span>
          </h4>
          <br />
          {this.state.tableSelect !== 'Overall' && <div>
            {this.state.clusteringRadar.length > 0 ?
              <div>
                <h4>{ this.state.tableSelect }</h4>
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
              /></div> :
              <div>
                <SpinningLogo glyph="refresh" /> Clustering...
              </div>
            }
          </div>}
          {this.state.radar.length && this.state.tableSelect === 'Overall' &&
            <div>
              <h4>{ this.state.tableSelect }</h4>
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
            </div>
          }
        </Left>
        <Right>
          <TableDiseaseMatch
            data={this.state.table}
            sortCallBack={this.sortTableCallBack}
            onRowClick={this.handleTableRowClick}
          />
          
          <br />
          <h4>{ this.state.tableSelect }</h4>
          {
            Object.keys(this.state.triptych).length > 0 ?
            <div>
              {
                 Object.keys(this.state.triptych).map((category, $index) => {
                   return (
                    <TriptychSection key={$index}>
                      <TriptychCategory>{category}</TriptychCategory>
                      <Triptych data={this.state.triptych[category]}/>
                    </TriptychSection>
                   )
                 }) 
              }
            </div> :
            <div>
              <SpinningLogo glyph="refresh" /> Loading Triptych Data...
            </div>
            
          }
        </Right>

      </div>
    );
  }
}
